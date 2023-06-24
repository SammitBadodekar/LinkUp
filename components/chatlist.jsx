const Chatlist = (props) => {
  const { friends, active, setActive } = props;
  return (
    <div className="chatList overflow-y-scroll">
      {friends?.map((friend) => {
        return (
          <article
            key={friend}
            className={`w-full p-2 dark:text-white text-black my-1 max-w-xs  ${
              active === friend ? " bg-slate-200 dark:bg-DarkButNotBlack" : ""
            }`}
            onClick={() => setActive(`${friend}`)}
          >
            {friend}
          </article>
        );
      })}
    </div>
  );
};
export default Chatlist;
