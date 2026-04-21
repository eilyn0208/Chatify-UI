const AVATAR_COLORS = [
  '#5865f2', '#eb459e', '#57f287', '#ed4245',
  '#ffa500', '#1abc9c', '#9b59b6',
];

function getColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function Users({ users = [] }) {
  const onlineUsers = users.length > 0 ? users : ['Usuario'];

  return (
    <>
      <div className="members-category">En línea — {onlineUsers.length}</div>

      {onlineUsers.map(user => (
        <div key={user} className="member-item">
          <div className="member-avatar online" style={{ background: getColor(user) }}>
            {user.charAt(0).toUpperCase()}
          </div>
          <span className="member-name">{user}</span>
        </div>
      ))}

      <div className="members-category" style={{ marginTop: '16px' }}>Sin conexión — 0</div>
    </>
  );
}

export default Users;