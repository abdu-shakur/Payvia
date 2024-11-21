const token = localStorage.getItem('token');
const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };


export {config, token}