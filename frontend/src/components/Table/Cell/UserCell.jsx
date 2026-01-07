import React from 'react';
import {Link} from "@inertiajs/react";

const UserCell = ({value, row}) => {
  const actionName = value.actionName;
  const action = row.values.rowActions?.find(e => e.name === actionName)?.action ?? function(){console.log(1)};
  const url = (typeof value.getUrl === 'function') && value.getUrl(row.original?.id);

  const UserCellItem = () => {
    return (
      <div className="flex items-center h-full">
        <div className="flex-shrink-0 h-7 w-7">
          { value.image ? (<img className="h-7 w-7 rounded-full object-cover" src={value.image} alt=""/>) : ''}
          { !value.image && value.disableEmptyImage ? (<></>) : '' }
          { !value.image && !value.disableEmptyImage ? (<img className="h-7 w-7 rounded-full object-cover" src='/img/no-user-photo.jpg' alt=""/>) : ''}
        </div>
        <div className="flex-shrink-1 pl-4 text-left">
          <div className={` ${ actionName ? 'text-indigo-600 hover:text-indigo-900' : ''}`}>{value.name}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      {(url || actionName) ? (
        <Link className={`break-all ${ actionName ? 'cursor-pointer' : ''}`} {...(url ? {href: url} : {onClick: action} )}>
          <UserCellItem/>
        </Link>
      ) : (
        <div className="break-all">
          <UserCellItem/>
        </div>
      )}
    </>
  );
};

export default UserCell;
