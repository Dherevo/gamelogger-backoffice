import { defineComponent } from 'vue';
import baseInput from '../base-input';
import Time from '../../../../modules/time';
import DatePicker from 'primevue/datepicker';
import Config from '../../../../modules/config';
import InputMask from 'primevue/inputmask';
import Popover from 'primevue/popover';

export default defineComponent({

    components: { DatePicker, InputMask, Popover },

    mixins: [baseInput],

    props: {
        range: {
            type: Boolean
        },
        months: {
            type: Number,
            default: 1
        },
        min: {
            type: String
        },
        max: {
            type: String
        },
        inline: {
            type: Boolean
        },
        time: {
            type: Boolean
        }
    },

    emits: [
        'update:modelValue'
    ],

    data() {
        const data : {
            dateValue: Date|(Date|null)[]|null,
            minDate?: Date,
            maxDate?: Date,
            dateText: string,
            date1Invalid: boolean,
            dateText2: string,
            date2Invalid: boolean,
            calendarMask: string,
            hourText: string,
            minuteText: string,
            timeDate: Date,
            invalidDate: boolean
        } = {
            dateValue: null,
            minDate: undefined,
            maxDate: undefined,
            dateText: '',
            date1Invalid: false,
            dateText2: '',
            date2Invalid: false,
            calendarMask: '',
            hourText: '',
            minuteText: '',
            timeDate: new Date('2000-01-01 00:00:00'),
            invalidDate: false
        };
        return data;
    },

    watch: {
        modelValue(_: any) {
            this.updateLocalValue();
        },
        min(newValue: any) {
            this.minDate = Time.instance(newValue).toDate();
        },
        max(newValue: any) {
            this.maxDate = Time.instance(newValue).toDate();
        }
    },

    created() {
        this.updateLocalValue();

        if (this.min) {
            this.minDate = Time.instance(this.min).toDate();
        }
        if (this.max) {
            this.maxDate = Time.instance(this.max).toDate();
        }
    },

    methods: {

        // Get the format used for dates in the project configuration file
        getDateFormat() {
            return Config.get('time.date');
        },

        // Prime uses one format, while Moment (Time) uses another.
        // So we need to translate one format to the other
        momentToPrimeFormat(): string {
            const map: Record<string, string> = {
              // Day
              'DDDD': 'oo',   // day of year (3 digit)
              'DDD': 'o',     // day of year
              'DD': 'dd',     // day (2 digit)
              'D': 'd',       // day
          
              // Weekday
              'dddd': 'DD',   // full day name
              'ddd': 'D',     // short day name
          
              // Month
              'MMMM': 'MM',   // full month name
              'MMM': 'M',     // short month name
              'MM': 'mm',     // month (2 digit)
              'M': 'm',       // month
          
              // Year
              'YYYY': 'yy',   // 4 digit year
              'YY': 'y',      // 2 digit year
          
              // Timestamp
              'x': '@',       // unix ms
            };
          
            // Replace longest tokens first
            const tokens = Object.keys(map).sort((a, b) => b.length - a.length);
          
            let result = this.getDateFormat();
          
            for (const token of tokens) {
              result = result.replace(new RegExp(token, 'g'), map[token]);
            }
          
            return result;
        },

        isActiveDay(date: {
            year: number,
            month: number,
            day: number
        }) {
            if (!this.dateValue) return false;

            if (Array.isArray(this.dateValue)) {
                return false;
            }

            const d = Time.fromDate(this.dateValue);
            return d.get('year') == date.year && d.get('month') == (date.month+1) && d.get('day') == date.day;
        },

        calendarDateSelected($event: any) {
            if (!this.range) {
                this.ref('popover').hide();
                this.updateValue($event);
            }
            else {
                let range : any = (this.modelValue as (Time|null)[]) ?? [];
                range = range.map((t: Time|null) => t ? t.toDate() : null);
                
                if (range.length == 0) {
                    range.push($event);
                    range.push(null);
                }
                else if (range.length == 1) {
                    if (range[0]) {
                        range.push($event);
                        this.ref('popover').hide();
                    } else {
                        range[0] = $event;
                    }
                }
                else if (range.length == 2) {
                    if (range[1]) {
                        range = [$event, null];
                    } else {
                        range[1] = $event;
                        this.ref('popover').hide();
                    }
                }

                this.updateValue(range);
            }
        },

        checkCalendarTextFormat(input : 1|2 = 1) {

            const text = input == 1 ? this.dateText : this.dateText2;
            if (text == '') return;

            const setInvalid = () => {
                this.invalidDate = true;
                if (input == 1) {
                    this.dateText = '';
                    this.date1Invalid = true;
                    setTimeout(() => {
                        this.date1Invalid = false;
                        setTimeout(() => {
                            const ref = this.ref('calendarInput');
                            if (ref) ref.$el.focus();
                        })
                    })
                }
                else {
                    this.dateText2 = '';
                    this.date2Invalid = true;
                    setTimeout(() => {
                        this.date2Invalid = false;
                        setTimeout(() => {
                            const ref = this.ref('calendarInput2');
                            if (ref) ref.$el.focus();
                        })
                    })
                }
            }

            this.invalidDate = false;
            if (text.includes('_')) return;

            const t = new Time(text, this.getDateFormat());
            if (t.invalid) {
                return setInvalid();
            }

            if (this.hourText) t.set('hour', this.hourText);
            if (this.minuteText) t.set('minute', this.minuteText);

            // Check min and max:
            if (this.min && t.format('YYYY-MM-DD') < this.min) {
                return setInvalid();
            }
            if (this.max && t.format('YYYY-MM-DD') > this.max) {
                return setInvalid();
            }

            const whenSimpleInput = () => {
                this.updateValue(t.toDate());

                const popover = this.ref('popover');
                if (popover) popover.hide();
                const calendarInput = this.ref('calendarInput');
                if (calendarInput) calendarInput.$el.blur();

                if (this.time) {
                    setTimeout(() => {
                        const r = this.ref('hourInput');
                        if (r && (!this.hourText || this.hourText == '00')) {
                            r.$el.click();
                            r.$el.focus();
                        }
                    }, 100)
                }
            }

            const whenRangeInput = () => {
                const secondCalendarInput = this.ref('calendarInput2');

                if (input == 1) {
                    this.updateValue([t.toDate(), null]);
                    if (secondCalendarInput) secondCalendarInput.$el.focus();
                } else {
                    this.updateValue([(this.dateValue as any)[0], t.toDate()]);
                    if (secondCalendarInput) secondCalendarInput.$el.blur();
                    const popover = this.ref('popover');
                    if (popover) popover.hide();
                }
            }

            return this.range ? whenRangeInput() : whenSimpleInput();
        },

        onTimeInputsBlur() {
            let h = this.hourText.replaceAll('_', '');
            if (h == '') return;
            if (h.length == 1) {
                const n = Number(h);
                if (n > 2) h = '0'+h;
                else return;
            }
            let m = this.minuteText.replaceAll('_', '');
            if (m.length == 1) {
                const n = Number(m);
                if (n > 6) m = '0'+m;
                else return;
            }
            const t = this.modelValue ? (this.modelValue as Time).copy() : Time.instance();
            t.set('hour', h);
            t.set('minute', m);
            this.updateValue(t.toDate());

            this.timeDate = t.toDate();
            const popover = this.ref('timePopover');
            if (popover) popover.$forceUpdate();
        },
        
        // Automatically focus the "mm" input when "HH" is complete
        checkTimeAutoFocus(input: 'hour' | 'minute', $event: any) {
            if (input == 'hour') {
                const r = this.ref('minuteInput') as any;
                if (!r) return;
                if (this.hourText == '') return;
    
                const h = this.hourText.replaceAll('_', '');
    
                if (h.length == 1) {
                    const n = Number(h);
                    if (n > 2) {
                        this.hourText = '0' + h;
                        setTimeout(() => {
                            r.$el.focus();
                        }, 100);
                    }
                } else if ($event.target.selectionStart == 2) {
                    setTimeout(() => {
                        r.$el.focus();
                    }, 100);
                }
            }
            else {
                if (this.minuteText == '') return;
                const r = this.ref('minuteInput') as any;
                const m = this.minuteText.replaceAll('_', '');

                if (m.length == 1) {
                    const n = Number(m);
                    if (n > 6) {
                        this.minuteText = '0' + m;
                        setTimeout(() => {
                            r.$el.blur();
                        }, 100);
                    }
                } else if ($event.target.selectionStart == 2) {
                    setTimeout(() => {
                        r.$el.blur();

                        const popover = this.ref('timePopover');
                        if (popover) popover.hide();
                    }, 100);
                }
            }
        },

        // Text to display when we want a readonly input
        readonlyText() {
            if (!this.modelValue) return '';

            if (this.range) {
                const m = this.modelValue as (Time|null)[];

                const a = m.length > 0 ? m[0] : undefined;
                const b = m.length > 1 ? m[1] : undefined;

                const strA = a ? a.format(this.getDateFormat()) : '';
                const strB = b ? b.format(this.getDateFormat()) : '';

                return strA + ' - ' + strB;
            }

            const m = this.modelValue as Time;
            return m.format(this.getDateFormat());
        },

        togglePopover(event: any) {
            this.ref('popover').toggle(event);
        },
        toggleTimePopover(event: any) {
            this.ref('timePopover').toggle(event);
        },

        setValue(value: any) {
            this.$emit('update:modelValue', value);
        },

        updateLocalValue() {

            const updateCalendarMask = () => {
                const f = this.getDateFormat();
                let mask = '';

                const isLetter = (c: string) => {
                    const na = "a".charCodeAt(0);
                    const nz = "z".charCodeAt(0);
                    const nA = "A".charCodeAt(0);
                    const nZ = "Z".charCodeAt(0);
                    const n = c.charCodeAt(0);
                    return (n >= na && n <= nz) || (n >= nA && n <= nZ);
                }

                for(let i = 0; i < f.length; ++i) {
                    const c = f[i];
                    if (isLetter(c)) {
                        mask += '9';
                    }
                    else {
                        mask += c;
                    }
                }

                this.calendarMask = mask;
            }
            updateCalendarMask();

            const val = this.modelValue;
            if (!val) return;

            const updateLocalValueSimpleInput = () => {
                this.dateText = this.modelValue ? (this.modelValue as Time).format(this.getDateFormat()) : '';
                this.hourText = this.modelValue ? (this.modelValue as Time).format('HH') : '';
                this.minuteText = this.modelValue ? (this.modelValue as Time).format('mm') : '';
                this.dateValue = this.modelValue ? (this.modelValue as Time).toDate() : null;
                this.timeDate = this.modelValue ? (this.modelValue as Time).toDate() : new Date('2000-01-01 00:00:00');
            }
    
            const updateLocalValueRangeInput = (val: any) => {
                const aux: any[] = [];
                for(const dt of val) {
                    if (!dt) {
                        aux.push(dt);
                    }
                    else aux.push(dt.toDate())
                }
                this.dateValue = aux;

                if (this.modelValue) {
                    const m = (this.modelValue as Time[]);

                    this.dateText = m.length > 0 && m[0] ? m[0].format(this.getDateFormat()) : '';
                    this.dateText2 = m.length > 1 && m[1] ? m[1].format(this.getDateFormat()) : '';
                    this.dateValue = this.modelValue ? (this.modelValue as (Time|null)[]).map(t => t ? t.toDate() : null) : null;

                    /*let r = this.ref('calendarInput');
                    if (r) r.$el.value = this.dateText;
                    r = this.ref('calendarInput2');
                    if (r) r.$el.value = this.dateText2;*/
                }
            }

            if (!this.range) {
                updateLocalValueSimpleInput();
            }
            else if (Array.isArray(val)) {
                updateLocalValueRangeInput(val);
            }
        },

        updateValue(value: any) {

            const updateValueSimple = (value: any) => {
                if (!value) {
                    this.setValue(undefined);
                    return;
                }
    
                this.setValue(Time.fromDate(value));
            }
    
            const updateValueRange = (value: any) => {
    
                const aux: any[] = [];
                if (value) {
                    for(const d of value) {
                        if (!d) {
                            aux.push(d);
                            continue;
                        }
                        aux.push(Time.fromDate(d));
                    }
                }
                this.setValue(aux);
            }

            if (!this.range)
                updateValueSimple(value);

            else
                updateValueRange(value);
        },

        updateTimeTextsFromPicker() {
            const t = Time.fromDate(this.timeDate);
            this.hourText = t.format('HH');
            this.minuteText = t.format('mm');
        }
    }
});