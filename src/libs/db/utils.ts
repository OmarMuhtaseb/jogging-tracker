export class Utils {
    private static preProcess(s: string): string {
        if (s[0] !== '(') {
            return `(${s})`;
        }
        return s;
    }

    private static parseComparisonOps(s: string): string {
        const comparisonsRep = {
            'eq': ':{$eq:',
            'ne': ':{$ne:',
            'gt': ':{$gt:',
            'lt': ':{$lt:',
        };

        const reg = `\\(\\w*\\s(${Object.keys(comparisonsRep).join('|')})\\s.*?\\)`;
        const regex = new RegExp(reg, 'gi');
        return s.replace(regex, matched => {
            const opRegex = new RegExp(`(${Object.keys(comparisonsRep).join('|')})`, 'gi');
            const opReplaced = matched.replace(opRegex, opMatched => comparisonsRep[opMatched.toLowerCase()]);
            return `({${opReplaced.substr(1, opReplaced.length - 2)}}})`;
        });
    }

    private static parseLogicOps(s: string): string {
        const comparisonsRep = {
            ' and ': '&',
            ' or ': '|',
        };

        const regex = new RegExp(Object.keys(comparisonsRep).join('|'), 'gi');
        return s.replace(regex, matched => comparisonsRep[matched.toLowerCase()]);
    }

    private static resolveFilter(terms: any[], stack: string[]): void {
        let item = stack.pop();
        while (item && item !== '(') {
            if (item === '&') {
                const x = terms.pop();
                const y = terms.pop();
                terms.push({$and: [x, y]});
            } else if (item === '|') {
                const x = terms.pop();
                const y = terms.pop();
                terms.push({$or: [x, y]});
            } else {
                terms.push(item);
            }
            item = stack.pop();
        }
    }

    private static reduceFilters(str: string): Record<string, any> {
        const stack = [];
        const terms = [];

        for (let i = 0; i < str.length; i++) {

            if (str[i] === '&' || str[i] === '|') {
                stack.push(str[i]);
            } else if (str[i] === '(') {
                stack.push(str[i]);
            } else if (str[i] === ')') {
                Utils.resolveFilter(terms, stack);
            } else {
                let term = '';
                while (i < str.length && str[i] !== ')') {
                    term += str[i];
                    i++;
                }
                i--;

                terms.push(eval(`(${term})`));
            }
        }

        while (stack.length) {
            Utils.resolveFilter(terms, stack);
        }
        return terms[0];
    }


    public static parseFilters(filters: string) {
        if (!filters) {
            return {};
        }

        filters = filters.trim();
        if (filters === '') {
            return {};
        }

        filters = Utils.preProcess(filters);
        filters = Utils.parseComparisonOps(filters);
        filters = Utils.parseLogicOps(filters);
        return Utils.reduceFilters(filters);
    }
}
