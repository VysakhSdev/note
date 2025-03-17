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
  const doGetTasks = async (data) => {
    const res = await axiosConfig.get(`/task/get-task`, data);
    return res;
  };
  const doGetPrivateTasks = async (id) => {

    const res = await axiosConfig.get(`/task/get-task?userId=${id}`);
    return res;

  };
  const doUpdateTask = async (id, taskData) => {
    const res = await axiosConfig.patch(`/task/edit-task?id=${id}`, taskData);
    return res;
  };
  





  const doCreateTasks = async (data) => {
    const res = await axiosConfig.post("/task/create-task", data);

    return res;
  };
  const doDeleteTasks = async (id) => {
    const res = await axiosConfig.delete(`/task/delete-task/${id}`);
    return res;
  };
 

  const doDeleteEvents = async (id) => {
    const res = await axiosConfig.delete(`/event/delete-event/${id}`);
    return res;
  };

  
  const doCreateEvents = async (data) => {
    const res = await axiosConfig.post("/event/create-event", data);

    return res;
  };
  const doGetEvents = async () => {
    const res = await axiosConfig.get("/event/get-event");

    return res;
  };
  const doUpdateEvent = async (id, eventData) => {
    const res = await axiosConfig.patch(`/event/update-event?id=${id}`, eventData);
    return res;
  };


 

  return { doLogin, doSignUp,doDeleteEvents, doGetTasks,doUpdateEvent, doGetPrivateTasks ,doCreateTasks,doDeleteTasks,doUpdateTask,doGetEvents,doCreateEvents};
};




export default authAPI;
