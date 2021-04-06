const ActiveUsers = ({ activeUsers }) => {
  return (
    <div>
      {activeUsers?.map((user) => (
        <p>{user}</p>
      ))}
    </div>
  );
};

export default ActiveUsers;
