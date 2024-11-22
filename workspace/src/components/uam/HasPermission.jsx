import React from "react";

export default function HasPermission({
  permission,
  permissionName,
  children,
  hideOrDisable,
}) {
  const ModifiedChildren = React.isValidElement(children)
    ? React.cloneElement(children, {
        // Update the onClick handler conditionally based on permission
        onClick: permission?.includes(permissionName)
          ? children.props.onClick
          : () => alert("Permission denied"),
      })
    : children;

  return permission?.includes(permissionName) && hideOrDisable === "hide" ? (
    <>{children}</>
  ) : (
    hideOrDisable === "disable" && <ModifiedChildren />
  );
}
