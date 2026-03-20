import { useDispatch, useSelector } from "react-redux";
import {
  applyToProject,
  fetchMyApplications,
  fetchProjectApplications,
  updateAppStatus,
} from "../store/slices/applicationSlice.js";

const useApplications = () => {
  const dispatch = useDispatch();
  const { myApplications, projectApplications, loading, error } =
    useSelector((state) => state.applications);

  return {
    myApplications,
    projectApplications,
    loading,
    error,
    apply:           (projectId, data) => dispatch(applyToProject({ projectId, data })),
    fetchMy:         (query)           => dispatch(fetchMyApplications(query)),
    fetchForProject: (projectId)       => dispatch(fetchProjectApplications(projectId)),
    updateStatus:    (id, data)        => dispatch(updateAppStatus({ id, data })),
  };
};

export default useApplications;