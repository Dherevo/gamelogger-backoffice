
type ValidatorRule = {
    name: string,
    function: (value: any, param: any) => boolean,
    parameter?: any,
    error?: string
}

export default class Validator {

    public name: string = '';
    private value?: () => any;

    private parent?: Validator;
    private validators: {[name: string]: Validator} = {};

    private checks: ValidatorRule[];
    private debugMode: boolean = false;

    public error: boolean = false;
    public errorMessage?: ((value: any) => string);

    private _callbacks: {[name: string]: ((valid: boolean, displayErrors: boolean) => void)} = {};
    public onValidated(name: string, callback: ((valid: boolean, displayErrors: boolean) => void)) {
        this._callbacks[name] = callback;
    }

    private formInput?: any;
    public setFormInput(formInput: any) {
        this.formInput = formInput;
        this.value = () => formInput.modelValue;
        for(const validator of Object.values(this.validators)) {
            validator.setFormInput(formInput);
        }
    }

    constructor(value?: () => any) {
        if (value !== undefined) this.value = value;
        this.checks = [];
    }

    static for(value: any) {
        if (typeof value == 'function') {
            return new Validator(value);
        }
        return new Validator(() => value);
    }

    getParent() {
        return this.parent;
    }

    causesError(error: string|((value: any) => string)) {
        if (typeof error == 'string') {
            this.errorMessage = () => error;
        } else {
            this.errorMessage = error;
        }
        return this;
    }

    debug() {
        this.debugMode = true;
        for(const validator of Object.values(this.validators)) {
            validator.debug();
        }
        return this;
    }

    add(name: string, value?: any) {
        const validator = value instanceof Validator ? value : new Validator(value ?? this.value);
        this.validators[name] = validator;
        validator.parent = this;
        validator.name = name;

        if (this.debugMode) {
            validator.debug();
        }
        return validator;
    }

    remove(name: string) {
        delete this.validators[name];
        return this;
    }

    use(value: any) {
        this.value = () => value;
        for(const validator of Object.values(this.validators)) {
            validator.value = () => value;
        }
        return this;
    }

    getter(valueGetter: () => any) {
        this.value = valueGetter;
        for(const validator of Object.values(this.validators)) {
            validator.value = valueGetter;
        }
        return this;
    }

    get(name: string) {
        return this.validators[name] ?? undefined;
    }

    isString(errorMessage?: string) {
        this.checks.push({
            name: this.name + ' isString',
            error: errorMessage,
            function: function(value: any) {
                return typeof value == 'string';
            }
        });

        return this;
    }

    is(e: any, errorMessage?: string) {

        this.checks.push({
            name: this.name + ' is',
            error: errorMessage,
            function: function(value: any, param: any) {
                return value === param;
            },
            parameter: e
        });

        return this;

    }

    isNot(e: any, errorMessage?: string) {

        this.checks.push({
            name: this.name + ' isNot',
            error: errorMessage,
            function: function(value: any, param: any) {
                return value != param;
            },
            parameter: e
        });

        return this;

    }

    typeIs(type: string|string[], errorMessage?: string) {

        this.checks.push({
            name: this.name + ' typeIs ' + type,
            error: errorMessage,
            function: function(value: any, param: string|string[]) {
                const type = typeof value;
                const types = typeof param == 'string' ? [param] : param;

                for(const t of types) {
                    if (type == t) {
                        return true;
                    }
                }
                return false;
            },
            parameter: type
        });

        return this;

    }

    typeIsNot(type: string|string[], errorMessage?: string) {

        this.checks.push({
            name: this.name + ' typeIsNot ' + type,
            error: errorMessage,
            function: function(value: any, param: string|string[]) {
                const type = typeof value;
                const types = typeof param == 'string' ? [param] : param;

                for(const t of types) {
                    if (type == t) {
                        return false;
                    }
                }
                return true;
            },
            parameter: type
        });

        return this;

    }

    isArray(errorMessage?: string) {

        this.checks.push({
            name: this.name + ' isArray',
            error: errorMessage,
            function: function(value: any) {
                return Array.isArray(value);
            },
        });

        return this;

    }

    isNotArray(errorMessage?: string) {

        this.checks.push({
            name: this.name + ' isNotArray',
            error: errorMessage,
            function: function(value: any) {
                return !Array.isArray(value);
            },
        });

        return this;

    }

    contains(e: any, errorMessage?: string) {

        this.checks.push({
            name: this.name + ' contains ' + e,
            error: errorMessage,
            function: function(value: any, param: any) {
                if (!value || !value['includes']) return false;
                return value.includes(param);
            },
            parameter: e
        });

        return this;

    }

    notContains(e: any, errorMessage?: string) {

        this.checks.push({
            name: this.name + ' notContains ' + e,
            error: errorMessage,
            function: function(value: any, param: any) {
                if (!value || !value['includes']) return false;
                return !value.includes(param);
            },
            parameter: e
        });

        return this;

    }

    minLength(length: number, errorMessage?: string) {
        this.checks.push({
            name: this.name + ' minLength ' + length,
            error: errorMessage,
            function: function(value: any, param: number) {
                if (!value || !value['length']) return false;
                return value.length >= param;
            },
            parameter: length
        });

        return this;
    }

    maxLength(length: number, errorMessage?: string) {
        this.checks.push({
            name: this.name + ' maxLength ' + length,
            error: errorMessage,
            function: function(value: any, param: number) {
                if (!value || !value['length']) return false;
                return value.length <= param;
            },
            parameter: length
        });

        return this;
    }

    isEmail(errorMessage?: string) {
        this.checks.push({
            name: this.name + ' isEmail',
            error: errorMessage,
            function: function(email: any) {
                if (!email) return false;
                if (email == "") return false;
                if (email.length < 4) return false;
        
                const c1 = email.indexOf("@");
                const c2 = email.lastIndexOf(".");
                if (c1 < 0) return false;
                if (c2 < 0) return false;
                if (c2 < c1) return false;
        
                const parts1 = email.split('@');
                const parts2 = parts1[1].split('.');
                
                if (parts1[0] == '') return false;
                if (parts2[0] == '') return false;
                if (parts2[1] == '') return false;
        
                return true;
            }
        });

        return this;
    }

    isUppercase(errorMessage?: string) {
        this.checks.push({
            name: this.name + ' isUppercase',
            error: errorMessage,
            function: function(value: string) {
                if (typeof value != 'string') return false;
                if (!/^[a-zA-ZàáäâéèëêìíïîòóöôùúüûñÑÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛ]+$/.test(value)) {
                    return false;
                }
                return value == value.toUpperCase();
            }
        });

        return this;
    }

    isLowercase(errorMessage?: string) {
        this.checks.push({
            name: this.name + ' isLowercase',
            error: errorMessage,
            function: function(value: string) {
                if (typeof value != 'string') return false;
                if (!/^[a-zA-ZàáäâéèëêìíïîòóöôùúüûñÑÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛ]+$/.test(value)) {
                    return false;
                }
                return value == value.toLowerCase();
            }
        });

        return this;
    }

    hasUppercase(min = 1, errorMessage?: string) {
        this.checks.push({
            name: this.name + ' hasUppercase ' + min,
            error: errorMessage,
            function: function(value: string, param: number) {
                if (typeof value != 'string') return false;

                let count = 0;

                for(let i = 0; i < value.length; ++i) {
                    if (!/^[a-zA-ZàáäâéèëêìíïîòóöôùúüûñÑÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛ]+$/.test(value[i])) {
                        continue;
                    }

                    if (value[i].toUpperCase() == value[i]) {
                        count += 1;

                        if (count >= param) {
                            return true;
                        }
                    }

                }

                return false;
            },
            parameter: min
        });

        return this;
    }

    hasNotUppercase(errorMessage?: string) {
        this.checks.push({
            name: this.name + ' hasNotUppercase',
            error: errorMessage,
            function: function(value: string) {
                if (typeof value != 'string') return true;

                for(let i = 0; i < value.length; ++i) {
                    if (!/^[a-zA-ZàáäâéèëêìíïîòóöôùúüûñÑÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛ]+$/.test(value[i])) {
                        continue;
                    }

                    if (value[i] == value[i].toUpperCase()) {
                        return false;
                    }
                }

                return true;
            }
        });

        return this;
    }

    hasLowercase(min = 1, errorMessage?: string) {
        this.checks.push({
            name: this.name + ' hasLowercase ' + min,
            error: errorMessage,
            function: function(value: string, param: number) {
                if (typeof value != 'string') return false;

                let count = 0;

                for(let i = 0; i < value.length; ++i) {
                    if (!/^[a-zA-ZàáäâéèëêìíïîòóöôùúüûñÑÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛ]+$/.test(value[i])) {
                        continue;
                    }

                    if (value[i] == value[i].toLowerCase()) {
                        count += 1;

                        if (count >= param) {
                            return true;
                        }
                    }
                }

                return false;
            },
            parameter: min
        });

        return this;
    }

    hasNotLowercase(errorMessage?: string) {
        this.checks.push({
            name: this.name + ' hasNotLowercase',
            error: errorMessage,
            function: function(value: string) {
                if (typeof value != 'string') return true;

                for(let i = 0; i < value.length; ++i) {
                    if (!/^[a-zA-ZàáäâéèëêìíïîòóöôùúüûñÑÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛ]+$/.test(value[i])) {
                        continue;
                    }

                    if (value[i] == value[i].toLowerCase()) {
                        return false;
                    }
                }

                return true;
            }
        });

        return this;
    }

    isNumber(errorMessage?: string) {
        this.checks.push({
            name: this.name + ' isNumber',
            error: errorMessage,
            function: function(value: string|number) {
                if(typeof value == 'number') {
                    return true;
                }

                const chars = '+-0123456789,.';

                for(let i = 0; i < value.length; ++i) {
                    if (!chars.includes(value[i])) {
                        return false;
                    }
                }
                return true;
            }
        });

        return this;
    }

    hasNumbers(min = 1, errorMessage?: string) {

        this.checks.push({
            name: this.name + ' hasNumbers ' + min,
            error: errorMessage,
            function: function(value: any, param: number) {

                let count = 0;

                for(let i = 0; i < value.length; ++i) {

                    if ('0123456789'.includes(value[i])) {
                        count += 1;

                        if (count >= param) {
                            return true;
                        }
                    }
                }

                return false;
            },
            parameter: min
        });

        return this;

    }

    hasNotNumbers(errorMessage?: string) {

        this.checks.push({
            name: this.name + ' hasNotNumbers',
            error: errorMessage,
            function: function(value: string) {

                for(let i = 0; i < value.length; ++i) {
                    if ('0123456789'.includes(value[i])) {
                        return false;
                    }
                }

                return true;
            }
        });

        return this;

    }

    isLetters(errorMessage?: string) {
        this.checks.push({
            name: this.name + ' isLetters',
            error: errorMessage,
            function: function(value: string) {
                return /^[a-zA-ZÀ-ÖØ-öø-ÿ]+$/.test(value);
            }
        });

        return this;
    }

    hasLetters(min = 1, errorMessage?: string) {
        this.checks.push({
            name: this.name + ' hasLetters ' + min,
            error: errorMessage,
            function: function(value: string) {
                if (typeof value != 'string') return false;

                let count = 0;

                for(let i = 0; i < value.length; ++i) {
                    if (/^[a-zA-ZÀ-ÖØ-öø-ÿ]+$/.test(value[i])) {
                        count += 1;

                        if (count >= min) {
                            return true;
                        }
                    }
                }

                return false;
            }
        });

        return this;
    }

    hasNotLetters(errorMessage?: string) {
        this.checks.push({
            name: this.name + ' hasNotLetters',
            error: errorMessage,
            function: function(value: string) {
                if (typeof value != 'string') return true;

                for(let i = 0; i < value.length; ++i) {
                    if (/^[a-zA-ZÀ-ÖØ-öø-ÿ]+$/.test(value[i])) {
                        return false;
                    }
                }

                return true;
            }
        });

        return this;
    }

    isSpecialChars(errorMessage?: string) {
        this.hasSpecialChars(-1, errorMessage);
        return this;
    }

    hasSpecialChars(min = 1, errorMessage?: string) {
        this.checks.push({
            name: this.name + ' hasSpecialChars ' + min,
            error: errorMessage,
            function: function(value: string, param: number) {
                if (typeof value != 'string') return false;

                let count = 0;

                for(let i = 0; i < value.length; ++i) {
                    if (/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(value[i])) {
                        count += 1;

                        if (param != -1 && count >= param) {
                            return true;
                        }
                    }
                }

                if (param == -1 && count == value.length) {
                    return true;
                }

                return false;
            },
            parameter: min
        });

        return this;
    }

    hasNotSpecialChars(errorMessage?: string) {
        this.checks.push({
            name: this.name + ' hasNotSpecialChars',
            error: errorMessage,
            function: function(value: string) {
                if (typeof value != 'string') return true;

                for(let i = 0; i < value.length; ++i) {
                    if (/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(value[i])) {
                        return false;
                    }
                }

                return true;
            }
        });

        return this;
    }

    isPhone(errorMessage?: string) {

        this.checks.push({
            name: this.name + ' isPhone',
            error: errorMessage,
            function: function(value: string) {

                const v = "" + value;

                const valid = '+0123456789 -()';
                for(let i = 0; i < v.length; ++i) {
                    if (!valid.includes(v[i])) {
                        return false;
                    }
                }
                
                return true;
            }
        });

        return this;
    }

    isBool(errorMessage?: string) {
        this.checks.push({
            name: this.name + ' isBool',
            error: errorMessage,
            function: function(value: boolean) {
                return typeof value == 'boolean'
            }
        });

        return this;
    }

    has(property: string, errorMessage?: string) {
        this.checks.push({
            name: this.name + ' has ' + property,
            error: errorMessage,
            function: function(value: any, param: string) {
                return value[param] !== undefined;
            },
            parameter: property
        }); 

        return this;
    }

    notEmpty(errorMessage?: string) {
        this.checks.push({
            name: this.name + ' notEmpty',
            error: errorMessage,
            function: function(value: any) {
                if (!value) return false;
                
                if (Array.isArray(value)) {
                    if (value.length == 0) return false;
                } else {
                    return !!value;
                }

                return true;
            }
        }); 

        return this;
    }

    rule(checker: (value: any) => boolean, name: string = 'rule', errorMessage?: string) {
        this.checks.push({
            name: this.name + ' ' + name,
            error: errorMessage,
            function: checker
        });

        return this;
    }

    setInputError(message?: string) {
        if (!this.formInput) return;
        if (this.error) {
            if (!message && !this.errorMessage) return;
            this.formInput.localError = message ? message : this.errorMessage!(this.value ? this.value() : undefined);
        } else {
            this.formInput.localError = undefined;
        }
    }

    validate(setErrorMessages: boolean = true) {

        const validate = () => {
            this.error = false;

            if (this.value) {
                const v = this.value();
    
                for(const check of this.checks) {
    
                    const func = check['function'];
                    const param = check['parameter'];
        
                    const valid = func(v, param);
        
                    if (!valid) {
        
                        if (this.debugMode) {
                            console.log('FAILED: ' + check.name);
                        }
        
                        this.error = true;
                        if (setErrorMessages) this.setInputError(check.error);
                    }
        
                }
            }
    
            if (setErrorMessages) this.setInputError();
    
            for(const validator of Object.values(this.validators)) {
                if (!validator.validate(setErrorMessages)) {
                    this.error = true;
                }
            }
    
            return !this.error;
        }

        const result = validate();

        for(const callback of Object.values(this._callbacks)) {
            callback(result, setErrorMessages);
        }

        return result;
    }

}