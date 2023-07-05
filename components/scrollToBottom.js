const scrollToBottom = (ref, delay) => {
  setTimeout(() => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, delay);
};
export default scrollToBottom;
