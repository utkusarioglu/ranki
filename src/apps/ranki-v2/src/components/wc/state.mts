type WcStateOnChangeCb<InternalState> = (
  curr: InternalState,
  prev: InternalState | null,
) => Promise<void> | void;

type PropTransformer<Props, InternalState> = (p: Props) => InternalState;
type FilterCb<InternalState> = (
  prev: InternalState | null,
  curr: InternalState,
) => boolean;

export class WcState<Props, InternalState = Props> {
  private onChange: WcStateOnChangeCb<InternalState>;
  private prevIs: InternalState | null = null;
  private currIs!: InternalState;
  private transformer: PropTransformer<Props, InternalState> = (p) =>
    p as unknown as InternalState;
  private filterCb: FilterCb<InternalState> = () => true;

  constructor(
    onChange: WcStateOnChangeCb<InternalState>,
    keyCb?: FilterCb<InternalState>,
  ) {
    this.onChange = onChange;
    if (keyCb) {
      this.filterCb = keyCb;
    }
  }

  setFilter(cb: FilterCb<InternalState>) {
    this.filterCb = cb;
  }

  setTransformer(k: PropTransformer<Props, InternalState>) {
    this.transformer = k;
  }

  set(props: Props) {
    this.prevIs = this.currIs;
    this.currIs = this.transformer(props);
    if (!this.filterCb(this.prevIs, this.currIs)) return;
    return this.onChange(this.currIs, this.prevIs);
  }

  curr() {
    return this.currIs;
  }

  prev() {
    return this.prevIs;
  }
}
