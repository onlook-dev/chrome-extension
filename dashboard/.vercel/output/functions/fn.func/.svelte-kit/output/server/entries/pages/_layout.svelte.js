import { c as create_ssr_component, o as onDestroy, v as validate_component, m as missing_component, a as add_attribute, e as each, b as escape } from "../../chunks/ssr.js";
import "firebase/auth";
import "../../chunks/firebase.js";
import "firebase/firestore";
import { n as noop, a as assign, i as identity, s as subscribe, b as null_to_empty } from "../../chunks/utils.js";
import { t as toast } from "../../chunks/SvelteToast.svelte_svelte_type_style_lang.js";
import { w as writable } from "../../chunks/index.js";
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = /* @__PURE__ */ new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
function get_interpolator(a, b) {
  if (a === b || a !== a)
    return () => a;
  const type = typeof a;
  if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    throw new Error("Cannot interpolate values of different type");
  }
  if (Array.isArray(a)) {
    const arr = b.map((bi, i) => {
      return get_interpolator(a[i], bi);
    });
    return (t) => arr.map((fn) => fn(t));
  }
  if (type === "object") {
    if (!a || !b)
      throw new Error("Object cannot be null");
    if (is_date(a) && is_date(b)) {
      a = a.getTime();
      b = b.getTime();
      const delta = b - a;
      return (t) => new Date(a + t * delta);
    }
    const keys = Object.keys(b);
    const interpolators = {};
    keys.forEach((key) => {
      interpolators[key] = get_interpolator(a[key], b[key]);
    });
    return (t) => {
      const result = {};
      keys.forEach((key) => {
        result[key] = interpolators[key](t);
      });
      return result;
    };
  }
  if (type === "number") {
    const delta = b - a;
    return (t) => a + t * delta;
  }
  throw new Error(`Cannot interpolate ${type} values`);
}
function tweened(value, defaults = {}) {
  const store = writable(value);
  let task;
  let target_value = value;
  function set(new_value, opts) {
    if (value == null) {
      store.set(value = new_value);
      return Promise.resolve();
    }
    target_value = new_value;
    let previous_task = task;
    let started = false;
    let {
      delay = 0,
      duration = 400,
      easing = identity,
      interpolate = get_interpolator
    } = assign(assign({}, defaults), opts);
    if (duration === 0) {
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      store.set(value = target_value);
      return Promise.resolve();
    }
    const start = now() + delay;
    let fn;
    task = loop((now2) => {
      if (now2 < start)
        return true;
      if (!started) {
        fn = interpolate(value, new_value);
        if (typeof duration === "function")
          duration = duration(value, new_value);
        started = true;
      }
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      const elapsed = now2 - start;
      if (elapsed > /** @type {number} */
      duration) {
        store.set(value = new_value);
        return false;
      }
      store.set(value = fn(easing(elapsed / duration)));
      return true;
    });
    return task.promise;
  }
  return {
    set,
    update: (fn, opts) => set(fn(target_value, value), opts),
    subscribe: store.subscribe
  };
}
const css$2 = {
  code: "._toastItem.svelte-95rq8t{width:var(--toastWidth, 16rem);height:var(--toastHeight, auto);min-height:var(--toastMinHeight, 3.5rem);margin:var(--toastMargin, 0 0 0.5rem 0);padding:var(--toastPadding, 0);background:var(--toastBackground, rgba(66, 66, 66, 0.9));color:var(--toastColor, #fff);box-shadow:var(\n    --toastBoxShadow,\n    0 4px 6px -1px rgba(0, 0, 0, 0.1),\n    0 2px 4px -1px rgba(0, 0, 0, 0.06)\n  );border:var(--toastBorder, none);border-radius:var(--toastBorderRadius, 0.125rem);position:relative;display:flex;flex-direction:row;align-items:center;overflow:hidden;will-change:transform, opacity;-webkit-tap-highlight-color:transparent}._toastMsg.svelte-95rq8t{padding:var(--toastMsgPadding, 0.75rem 0.5rem);flex:1 1 0%}.pe.svelte-95rq8t,._toastMsg.svelte-95rq8t a{pointer-events:auto}._toastBtn.svelte-95rq8t{width:var(--toastBtnWidth, 2rem);height:var(--toastBtnHeight, 100%);cursor:pointer;outline:none}._toastBtn.svelte-95rq8t::after{content:var(--toastBtnContent, '✕');font:var(--toastBtnFont, 1rem sans-serif);display:flex;align-items:center;justify-content:center}._toastBar.svelte-95rq8t{top:var(--toastBarTop, auto);right:var(--toastBarRight, auto);bottom:var(--toastBarBottom, 0);left:var(--toastBarLeft, 0);height:var(--toastBarHeight, 6px);width:var(--toastBarWidth, 100%);position:absolute;display:block;-webkit-appearance:none;-moz-appearance:none;appearance:none;border:none;background:transparent;pointer-events:none}._toastBar.svelte-95rq8t::-webkit-progress-bar{background:transparent}._toastBar.svelte-95rq8t::-webkit-progress-value{background:var(--toastProgressBackground, var(--toastBarBackground, rgba(33, 150, 243, 0.75)))}._toastBar.svelte-95rq8t::-moz-progress-bar{background:var(--toastProgressBackground, var(--toastBarBackground, rgba(33, 150, 243, 0.75)))}",
  map: null
};
function check(prop, kind = "undefined") {
  return typeof prop === kind;
}
const ToastItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $progress, $$unsubscribe_progress;
  let { item } = $$props;
  let next = item.initial;
  let cprops = {};
  const progress = tweened(item.initial, { duration: item.duration, easing: identity });
  $$unsubscribe_progress = subscribe(progress, (value) => $progress = value);
  function close() {
    toast.pop(item.id);
  }
  function autoclose() {
    if ($progress === 1 || $progress === 0)
      close();
  }
  onDestroy(() => {
    if (check(item.onpop, "function")) {
      item.onpop(item.id);
    }
  });
  if ($$props.item === void 0 && $$bindings.item && item !== void 0)
    $$bindings.item(item);
  $$result.css.add(css$2);
  {
    if (!check(item.progress)) {
      item.next = item.progress;
    }
  }
  {
    if (next !== item.next) {
      next = item.next;
      progress.set(next).then(autoclose);
    }
  }
  {
    if (item.component) {
      const { props = {}, sendIdTo } = item.component;
      cprops = {
        ...props,
        ...sendIdTo && { [sendIdTo]: item.id }
      };
    }
  }
  $$unsubscribe_progress();
  return `<div role="status" class="${["_toastItem svelte-95rq8t", item.pausable ? "pe" : ""].join(" ").trim()}"><div class="${["_toastMsg svelte-95rq8t", item.component ? "pe" : ""].join(" ").trim()}">${item.component ? `${validate_component(item.component.src || missing_component, "svelte:component").$$render($$result, Object.assign({}, cprops), {}, {})}` : `<!-- HTML_TAG_START -->${item.msg}<!-- HTML_TAG_END -->`}</div> ${item.dismissable ? `<div class="_toastBtn pe svelte-95rq8t" role="button" tabindex="0"></div>` : ``} <progress class="_toastBar svelte-95rq8t"${add_attribute("value", $progress, 0)}></progress> </div>`;
});
const css$1 = {
  code: "._toastContainer.svelte-1u812xz{top:var(--toastContainerTop, 1.5rem);right:var(--toastContainerRight, 2rem);bottom:var(--toastContainerBottom, auto);left:var(--toastContainerLeft, auto);position:fixed;margin:0;padding:0;list-style-type:none;pointer-events:none;z-index:var(--toastContainerZIndex, 9999)}",
  map: null
};
function getCss(theme) {
  return theme ? Object.keys(theme).reduce((a, c) => `${a}${c}:${theme[c]};`, "") : void 0;
}
const SvelteToast = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $toast, $$unsubscribe_toast;
  $$unsubscribe_toast = subscribe(toast, (value) => $toast = value);
  let { options = {} } = $$props;
  let { target = "default" } = $$props;
  let items = [];
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.target === void 0 && $$bindings.target && target !== void 0)
    $$bindings.target(target);
  $$result.css.add(css$1);
  {
    toast._init(target, options);
  }
  items = $toast.filter((i) => i.target === target);
  $$unsubscribe_toast();
  return `<ul class="_toastContainer svelte-1u812xz">${each(items, (item) => {
    return `<li class="${escape(null_to_empty(item.classes?.join(" ")), true) + " svelte-1u812xz"}"${add_attribute("style", getCss(item.theme), 0)}>${validate_component(ToastItem, "ToastItem").$$render($$result, { item }, {}, {})} </li>`;
  })} </ul>`;
});
const css = {
  code: ":root{--toastBackground:#000000;--toastColor:#ffffff;--toastBarBackground:#ffffff;--toastBorderRadius:5px;--toastContainerTop:auto;--toastContainerRight:auto;--toastContainerBottom:2rem;--toastContainerLeft:calc(50vw - 8rem);--toastBarHeight:0px}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${slots.default ? slots.default({}) : ``} ${validate_component(SvelteToast, "SvelteToast").$$render(
    $$result,
    {
      options: {
        reversed: true,
        intro: { y: 192 },
        duration: 3e3
      }
    },
    {},
    {}
  )}`;
});
export {
  Layout as default
};
