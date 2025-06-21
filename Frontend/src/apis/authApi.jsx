import axiosConfig from '../config/axiosConfig';
const authAPI = () => {
  const doLogin = async (data) => {
    const res = await axiosConfig.post("user/login", data);
    return res;
  };
  const doSignUp = async (data) => {
    const res = await axiosConfig.post("user/signup", data);
    return res;
  };
  const doGetNotes = async (data) => {
    const res = await axiosConfig.get(`/notes/getNotes`, data);
    return res;
  };

  const doCreateNotes = async (data) => {
    const res = await axiosConfig.post("/notes/createNote", data);
    return res;
  };
   const doShareNote = async (data) => {
    const res = await axiosConfig.post("/notes/shareNotes", data);
    return res;
  };
const doUpdateNote = async (id, data) => {
  const res = await axiosConfig.put(`/notes/editNote/${id}`, data);  
  return res;
};

  
 

  return { doLogin, doSignUp, doCreateNotes,doGetNotes,doShareNote,doUpdateNote};
};




export default authAPI;
