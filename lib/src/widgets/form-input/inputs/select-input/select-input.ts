import { defineComponent, nextTick, PropType } from 'vue';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import AutoComplete from 'primevue/autocomplete';
import DatePicker from 'primevue/datepicker';
import MultiSelect from 'primevue/multiselect';
import IOption from '../../../../interfaces/IOption';
import baseInput from '../base-input';

export default defineComponent({

    components: {
        Select,
        AutoComplete,
        DatePicker,
        MultiSelect,
        InputText
    },

    mixins: [baseInput],

    props: {
        placeholder: {
            type: String
        },
        options: {
            type: Array as PropType<IOption[]>
        },
        multiple: {
            type: Boolean,
            default: false
        },
        suggestions: {
            type: Function as PropType<((query: string, resolve: ((suggestions: IOption[]) => void)) => void)>
        },
        comparer: {
            type: Function as PropType<(a: any, b: any) => boolean>,
            default: (a: any, b: any) =>
            a !== undefined &&
            a !== null &&
            b !== undefined &&
            b !== null &&
            (a == b ||
              (a.id && b.id && a.id == b.id) ||
              (a.value && b.value && a.value == b.value))
        },
        getOptionName: {
            type: Function as PropType<((value: string|undefined) => Promise<string>)>
        },
        appendTo: {
            type: String,
            default: 'body'
        },
        filter: {
            type: Boolean,
            default: false
        },
        nullable: {
            type: Boolean,
            default: false
        }
    },

    emits: [
        'blur',
        'focus',
        'keyup',
        'keydown',
        'update:modelValue',
        'complete',
        'pressEnter',
        'pressEscape',
        'tabPressed',
        'suggestion-selected',
        'stop',
        'close',
        'filter'
    ],

    data() {
        const data : {
            cachedOptions?: IOption[],
            selectedOptions: IOption[],
            selectOption: IOption|null,
            previousSuggestions: any[],
            emitAllowed: boolean,
            // If event suggestion-selected was triggered in last 100ms
            triggeredSuggestion: boolean,
            search: string,
            filtering: boolean,
            filterWriteCount: number,
            filteredOptions?: IOption[]
        } = {
            cachedOptions: undefined,
            selectedOptions: [],
            selectOption: null,
            previousSuggestions: [],
            emitAllowed: true,
            triggeredSuggestion: false,
            search: '',
            filtering: false,
            filterWriteCount: 0,
            filteredOptions: undefined
        }
        return data;
    },

    watch: {
        modelValue(newValue: any) {
            this.updateLocalValue(newValue);
        },
        options() {
            this.cachedOptions = undefined;
            this.updateLocalValue();
        }
    },

    mounted() {
        if (this.multiple && this.modelValue && Array.isArray(this.modelValue) && this.modelValue.length > 0) {

            const map : IOption[] = this.getDropdownOptions().slice();
            const selected : any[] = [];
            for(const item of this.modelValue) {
                for(const option of map) {
                    if (this.comparer!(item, option.value)) {
                        option.value = item;
                        selected.push(option);
                        const index = map.indexOf(option);
                        map.splice(index, 1);
                        break;
                    }
                }
            }
            this.selectedOptions = selected;
        }

        if (!this.multiple) {
            this.emitAllowed = false;
            this.updateLocalValue();
            this.emitAllowed = true;
        }

        this.mountedForSuggestions();
    },

    methods: {

        mountedForSuggestions() {
            if (this.suggestions && this.modelValue) {

                if (this.getOptionName) {
                    const r = this.getOptionName(this.modelValue as string)
                    if (r instanceof Promise) {
                        r.then((name: string) => {
                            this.selectOption = {
                                value: this.modelValue,
                                content: name
                            }
                        })
                    } else {
                        this.selectOption = {
                            value: this.modelValue,
                            content: r
                        }
                    }
                } else {
                    this.selectOption = {
                        value: this.modelValue,
                        content: this.modelValue as string
                    }
                }
            }
        },

        focusOnSearchFilter() {
            if (this.filter) {
                setTimeout(() => {
                    const input = this.$refs.filterInput as any;
                    if (input) input.$el.focus();
                })
            }
        },

        onSelectExpanded($event: any) {
            this.focusOnSearchFilter();
            this.passEmit('open', $event);
        },
        onSelectClosed($event: any) {
            this.filtering = false;
            this.filteredOptions = undefined;
            this.search = '';
            if (this.selectOption) {
                this.search = this.selectOption.content ?? this.selectOption.value;
            }
            if (this.filter) {
                this.filterChanged({ key: '' });
            }
            this.passEmit('close', $event);
        },

        setValue(value: any) {
            if (!this.emitAllowed) return;
            this.$emit('update:modelValue', value);
            if (!value) {
                this.selectOption = null;
                this.filteredOptions = undefined;
                this.search = '';
                this.filterChanged({ key: '' })
            }
        },

        updateValue(value: any) {
            this.stopEvent(value);
            this.filtering = false;

            if (this.multiple) {
                const arr: any[] = [];
                for (const i of value) {
                    if (!i) continue;
                    arr.push(i.value ?? i);
                }
                this.selectedOptions = value;
                this.setValue(arr);

                this.focusOnSearchFilter();

            } else {
                this.search = '';
                this.filteredOptions = undefined;

                if (value === undefined) {
                    this.selectOption = null;
                    this.setValue(value.value ?? value.content);
                } else {
                    this.selectOption = value;
                    this.setValue(value.value ?? value.content);
                }
            }
        },

        stopEvent(value?: any) {
            this.writeCount += 1;
            const currentWriteCount = this.writeCount;

            setTimeout(() => {
                if (currentWriteCount == this.writeCount) {
                    this.writeCount = 0;
                    this.$emit('stop', value);

                    if (this.suggestions) {
                        this.suggestions(value, suggestions => {
                            this.updateSuggestions(suggestions);
                        });
                    }
                }
            }, this.stopTime);
        },

        filterChanged($e: any) {
            if (['Tab', 
                'Escape', 
                'ArrowUp', 
                'ArrowLeft',
                'ArrowRight',
                'Shift',
                'Meta',
                'Alt',
                'Control',
                'CapsLock'
            ].includes($e.key)) {
                return;
            }

            if (['Enter', 'ArrowDown'].includes($e.key)) {
                const overlay = document.querySelector('.p-select-overlay > *[tabindex="0"]') as any;
                if (!overlay) return;
                overlay.focus();

                const select = (this.$refs.select as any);
                nextTick(() => {
                    select.onKeyDown({
                      code: 'ArrowDown',
                      preventDefault: () => {}
                    });
                  });
                return;
            }

            this.filtering = true;
            this.filterWriteCount += 1;
            const currentWriteCount = this.filterWriteCount;

            setTimeout(() => {
                if (currentWriteCount == this.filterWriteCount) {
                    this.filterWriteCount = 0;

                    this.$emit('filter', {
                        search: this.search,
                        stop: (options: IOption[]) => {
                            this.filteredOptions = options;
                            this.filtering = false;
                        }
                    })

                }
            }, this.stopTime);
        },

        updateLocalValueSingleDropdown(val: any) {
            if (this.selectOption && this.comparer(val, this.selectOption.value)) {
                return;
            }

            const list : any = this.options ? this.getDropdownOptions() : (this.suggestions ? this.suggestions : null);
            const isSelected = (v: any) => this.selectOption && v == this.selectOption;

            const checkOption = (op: IOption) => {
                if (!op.items) {
                    if (this.comparer(val, op.value)) {
                        if (isSelected(op)) return true;
                        this.selectOption = op;
                        this.setValue(op.value);
                        return true;
                    }
                } else {

                    for(const child of op.items) {
                        if (this.comparer(val, child.value)) {
                            if (isSelected(child)) return true;
                            this.selectOption = child;
                            return true;
                        }
                    }
                }

                return false;
            }

            if (list) {
                for(const op of list) {
                    if (checkOption(op)) break;
                }
            }

            if (!this.selectOption && val && typeof val == 'object' && val.name) {
                this.selectOption = {
                    value: val,
                    content: val.name
                }
            }
        },

        updateLocalValueMultipleDropdown(val: any) {
            const list: any = this.options
                ? this.getDropdownOptions()
                : this.suggestions
                ? this.suggestions
                : [];

            if (list && Array.isArray(val) && val.length > 0) {
                for (const op of list) {
                for (const o of val) {
                    if (this.comparer(op, o)) {
                    this.selectedOptions.push(op as any);
                    }
                }
                }
            }
        },

        updateLocalValue(value?: any) {

            const val = value !== undefined ? value : this.modelValue;
            if (val === null || val === undefined || val === "") {
                this.selectOption = null;
                return;
            }

            if (this.suggestions) return;

            if (!this.multiple) {
                this.updateLocalValueSingleDropdown(val);
            } else if (this.selectedOptions.length == 0) {
                this.updateLocalValueMultipleDropdown(val);
            }
        },

        getDropdownOptions() : IOption[] {
            if (this.filtering) {
                return [];
            }
            if (this.filteredOptions) {
                return this.filteredOptions;
            }

            if (this.cachedOptions) return this.cachedOptions;
            let arr : IOption[] = [];
            if (!this.options) return arr;
            arr = this.options;
            this.cachedOptions = arr;
            return arr;
        },
        getDropdownOptionsMap() {
            const ops = this.getDropdownOptions();
            const map: any = {};
            for (const i of ops) {
                map[typeof i.value == 'object' ? i.value.id : i.value] = i;
            }
            return map;
        },

        readonlyValue() {
            if (this.multiple) 
                return this.multiSelectValue();

            return this.selectOption ? (this.selectOption.content ?? this.selectOption.value) : (this.placeholder ?? '');
        },

        multiSelectValue() {
            if (!this.selectedOptions.length) return this.placeholder ?? '';

            return this.selectedOptions.map(item => item.content ?? item.value).join(', ');
        },

        autocompleteBlur() {
            setTimeout(() => {
                if (this.triggeredSuggestion) return;
                this.passEmit('blur', this.modelValue);

                if (!this.modelValue) {
                    this.suggestionSelected(null);
                }
            }, 50)
        },

        suggestionSelected(arg: IOption|null) {
            this.triggeredSuggestion = true;
            setTimeout(() => {
                this.triggeredSuggestion = false;
            }, 100);

            if (!arg) {
                this.selectOption = arg;
                this.setValue(arg);
                this.$emit('suggestion-selected', arg);
                return;
            }
            this.selectOption = arg;
            this.setValue(arg.value);
            this.$emit('suggestion-selected', arg.value);
        },

        onOpenSuggestions() {
            this.passEmit('open', this.modelValue);
            if (!this.suggestions) return;
            this.suggestions(this.modelValue as string, suggestions => {
                this.updateSuggestions(suggestions);
            });
        },

        updateSuggestions(suggestions: any[]) {
            if (!this.suggestions) return;
            this.previousSuggestions = suggestions.map(item => item)
        },

        onCloseSuggestions() {
            this.passEmit('close', this.modelValue)
        },
    }
});