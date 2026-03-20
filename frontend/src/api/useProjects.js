import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchProjects,
  fetchProjectById,
  createProject,
  deleteProject,
} from "../store/slices/projectSlice.js";

const useProjects = (query) => {
  const dispatch = useDispatch();
  const { projects, current, pagination, loading, error } = useSelector(
    (state) => state.projects
  );

  useEffect(() => {
    dispatch(fetchProjects(query));
  }, [dispatch]);

  return {
    projects,
    current,
    pagination,
    loading,
    error,
    fetchOne:  (id)   => dispatch(fetchProjectById(id)),
    create:    (data) => dispatch(createProject(data)),
    remove:    (id)   => dispatch(deleteProject(id)),
  };
};

export default useProjects;