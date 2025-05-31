const Notification = ({ notification }) => {
  if (notification === null) {
    return null;
  }
  const { msg, type } = notification;

  return (
    <div className={type}>
      {msg}
    </div>
  );
};

export default Notification;