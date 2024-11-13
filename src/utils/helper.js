// 1. This function delays invoking a function until after a certain amount of time has elapsed since the last time it was invoked.
// It's useful for scenarios like search input fields where you want to wait for the user to finish typing before triggering a search.

export function debounce(func, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

//2. This function limits the number of times a function can be called within a given period.
// It's useful for scenarios like scroll events where you want to limit the frequency of function calls.

export function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

//3. This function checks if a given value is empty (i.e., null, undefined, an empty string, empty array, or empty object).
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === "object" && Object.keys(value).length === 0) return true;
  return false;
}

//4. This function capitalizes the first letter of a string.
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

//5. This function truncates a string to a specified length and appends an ellipsis (...) if it exceeds that length.

export function truncateString(str, maxLength) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

//6. This function flattens a nested array into a single array.
export function flattenArray(arr) {
  return arr.reduce(
    (acc, val) => acc.concat(Array.isArray(val) ? flattenArray(val) : val),
    []
  );
}

//7. This function splits an array into chunks of a specified size.

export function chunkArray(array, size) {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, index * size + size)
  );
}

//8. This function formats a number as currency with a specified currency symbol and precision.

export function formatCurrency(amount, currencySymbol = "$", precision = 2) {
  return `${currencySymbol}${amount.toFixed(precision)}`;
}

//9. This function returns an array containing only unique values from the original array.
export function uniqueValues(array) {
  return Array.from(new Set(array));
}

//10. This function groups the elements of an array based on a given key.

export function groupBy(array, key) {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    return result;
  }, {});
}

//11. This function creates a deep copy of an object or array, ensuring that nested objects or arrays are also copied.
export function deepClone(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  let clone = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  return clone;
}

//12. This function sorts an array of objects by a specified key.

export function sortByKey(array, key) {
  return array.slice().sort((a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });
}

//13. This function flattens a nested object into a single level object, with keys representing the path to each value.
export function flattenObject(obj, prefix = "") {
  return Object.keys(obj).reduce((acc, key) => {
    const nestedKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], nestedKey));
    } else {
      acc[nestedKey] = obj[key];
    }
    return acc;
  }, {});
}

//14. This function recursively flattens nested arrays.

export function flattenDeep(arr) {
  return arr.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val),
    []
  );
}

//15. This function returns an array of unique values from multiple arrays.
export function getUniqueValues(...arrays) {
  return [...new Set(arrays.flat())];
}

//16. This function checks if a given string is a valid email address.

export function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

//17. This function capitalizes the first letter of every word in a string.
export function capitalizeEveryWord(str) {
  return str.replace(/\b\w/g, (match) => match.toUpperCase());
}

//18. This function calculates the average of an array of numbers.
export function arrayAverage(arr) {
  return arr.reduce((acc, val) => acc + val, 0) / arr.length;
}

//19. This function formats a date object into a string with a specified format.

export function formatDate(date, format = "YYYY-MM-DD") {
  const padZero = (num) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1);
  const day = padZero(date.getDate());
  return format.replace("YYYY", year).replace("MM", month).replace("DD", day);
}

//20. This function generates a random integer within a specified range.
export function randomIntInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//21. This function merges two objects deeply, combining nested objects and arrays.
export function deepMerge(obj1, obj2) {
  const merged = { ...obj1 };
  for (let key in obj2) {
    if (typeof obj2[key] === "object" && obj2[key] !== null) {
      merged[key] = deepMerge(obj1[key] || {}, obj2[key]);
    } else {
      merged[key] = obj2[key];
    }
  }
  return merged;
}

//22. This function converts a string to camel case.
export function camelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
      index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    )
    .replace(/\s+/g, "");
}

//23. Function for slicing an array
export function sliceArray(array, start = 0, end = array.length) {
  return array.slice(start, end);
}

//24.This function takes a string as input and replaces all underscores (_) with spaces ( ).

export const convertUnderscoreToSpace = (str) => {
  return str.replace(/_/g, " ");
};

// 25. Camel case spacing
export function camelCaseToSpaces(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1 $2");
}

//26. This functons is used to get the authorized routes
export const filterRoutesByPermissions = (routes, modules) => {
  const permittedRoutes = [];

  // Helper function to check if a route starts with a base route
  const routeMatches = (routePath, basePath) => routePath.startsWith(basePath);

  // Iterate over modules and screens to get allowed routes based on permission
  modules.forEach((module) => {
    module.subModules.forEach((subModule) => {
      subModule.subModuleScreens.forEach((screen) => {
        const hasPermission = screen.actions.some(
          (action) => action.hasPermission
        );
        if (hasPermission) {
          // Find routes where path starts with or matches the screen route
          routes.forEach((route) => {
            if (
              routeMatches(route.path, screen.screenRoute) ||
              route.path === screen.screenRoute
            ) {
              permittedRoutes.push(route);
            }
          });
        }
      });
    });

    module.screens.forEach((screen) => {
      const hasPermission = screen.actions.some(
        (action) => action.hasPermission
      );
      if (hasPermission) {
        // Find routes where path starts with or matches the screen route
        routes.forEach((route) => {
          if (
            routeMatches(route.path, screen.screenRoute) ||
            route.path === screen.screenRoute
          ) {
            permittedRoutes.push(route);
          }
        });
      }
    });
  });

  return permittedRoutes;
};
