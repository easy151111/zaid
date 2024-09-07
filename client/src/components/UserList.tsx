import Avatar from 'react-avatar';

type UserListProps = {
  users: [];
};

const UserList = ({
  users,
}: UserListProps) => {
  
  return (
    <>
      {users.map((item, index) => (
        <div key={index} className="w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar
              name={`${item.username.charAt(0)} ${item.username.slice(1)}`}
              size="40"
              textSizeRatio={1.75}
              round={true}
            />
            <div>
              <h1 className="text-white font-medium text-[15px]">
                {item.username}
              </h1>
              <span className="font-semibold">{item.RATS} RATS</span>
            </div>
          </div>

          <span className="w-[1.6rem] h-[2rem]">
            {index === 0 && (
              <img
                src="/assets/icons/first.png"
                alt="First_place"
                className="w-full h-full"
              />
            )}
            {index === 1 && (
              <img
                src="/assets/icons/second.png"
                alt="Second_place"
                className="w-full h-full"
              />
            )}
            {index === 2 && (
              <img
                src="/assets/icons/third.png"
                alt="Third_place"
                className="w-full h-full"
              />
            )}
            {index > 2 && (
              <span className="text-white font-semibold">#{index + 1}</span>
            )}
                  
          </span>
        </div>
      ))}
    </>
  );
};

export default UserList;