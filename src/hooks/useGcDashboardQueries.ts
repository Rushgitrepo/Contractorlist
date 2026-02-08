import { useQuery } from "@tanstack/react-query";
import { getProjects, getTeamMembers } from "@/api/gc-apis";

const PROJECTS_QUERY_KEY = "gc-projects";
const TEAM_MEMBERS_QUERY_KEY = "gc-team-members";

export const useProjectsQuery = (search?: string) => {
  const searchKey = (search ?? "").trim();

  return useQuery({
    queryKey: [PROJECTS_QUERY_KEY, { search: searchKey }],
    queryFn: () => {
      const params = searchKey ? { search: searchKey } : {};
      return getProjects(params);
    },
    staleTime: 60_000,
  });
};

export const useTeamMembersQuery = () => {
  return useQuery({
    queryKey: [TEAM_MEMBERS_QUERY_KEY],
    queryFn: () => getTeamMembers(),
    staleTime: 60_000,
  });
};
