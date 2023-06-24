const Chat = (props) => {
  const { active } = props;
  console.log(active);
  if (!active) {
    return;
  }
  return <div className=" h-full w-full">Chats form {active}</div>;
};
export default Chat;
