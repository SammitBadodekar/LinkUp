const scrollToBottom = (ref) => {
  setTimeout(() => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, 200);
};
export default scrollToBottom;
