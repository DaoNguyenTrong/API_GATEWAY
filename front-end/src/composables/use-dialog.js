import { shallowRef } from "vue";

export const useDialog = () => {
  const visible = shallowRef(false);
  const completed = shallowRef(false);

  const resolver = shallowRef();
  const rejecter = shallowRef();
  const promiseHandler = (resolve, reject) => {
    resolver.value = resolve;
    rejecter.value = reject;
  };

  const onClosed = async () => {
    visible.value = false;
    if (!completed.value) {
      rejecter.value("cancel");
    }
    completed.value = false;
  };
  return {
    visible,
    completed,
    resolver,
    rejecter,
    promiseHandler,
    onClosed,
  };
};
