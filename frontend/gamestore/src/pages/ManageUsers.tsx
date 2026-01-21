import { useEffect, useState } from "react";
import { getUsers, updateUserRole } from "../api/usersApi";
import type { PaginatedResponse } from "../types/pagination/paginatedResponse";
import type { UserWithRoles } from "../types/auth/auth";
import Navbar from "@components/Navbar";
import { Pagination } from "@components/Pagination";
import { useAuth } from "@hooks/useAuth";
import "../styles/manageUsers.css";

function UserList() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("username");
  const [sortDir, setSortDir] = useState<string>("asc");

  useEffect(() => {
    loadUsers();
  }, [search, sortBy, sortDir, currentPage]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column.toLowerCase());
      setSortDir("asc");
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = {
        search,
        pageNumber: currentPage,
        pageSize,
        sortBy,
        sortDir,
      };

      const res: PaginatedResponse<UserWithRoles> = await getUsers(params);
      setUsers(res.items);
      setTotalPages(Math.ceil(res.total / pageSize));
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeClass = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: "role-badge-admin",
      user: "role-badge-user",
      moderator: "role-badge-moderator",
    };
    return roleMap[role.toLowerCase()] || "role-badge-default";
  };

  const toggleAdmin = async (email: string) => {
    try {
      await updateUserRole(email);
      loadUsers();
    } catch (error) {
      console.error("Error actualizando rol:", error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="users-container">
        <div className="users-controls">
          <div className="search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por email o username..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            {search && (
              <button
                className="clear-search"
                onClick={() => setSearch("")}
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando usuarios...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <h3>No se encontraron usuarios</h3>
              <p>Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("username")} className="sortable">
                    Usuario
                  </th>
                  <th onClick={() => handleSort("email")} className="sortable">
                    Email
                  </th>
                  <th>Roles</th>
                  <th>Admin</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => {
                  const isCurrentUser =
                    currentUser?.email === user.email;

                  const isAdmin = user.roles.some(
                    (role) => role.toLowerCase() === "admin"
                  );

                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="user-name">{user.username}</span>
                        </div>
                      </td>

                      <td>
                        <span className="user-email">{user.email}</span>
                      </td>

                      <td>
                        <div className="roles-container">
                          {user.roles.map((role, index) => (
                            <span
                              key={index}
                              className={`role-badge ${getRoleBadgeClass(role)}`}
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td>
                        <label
                          className={`switch ${
                            isCurrentUser ? "switch-disabled" : ""
                          }`}
                          title={
                            isCurrentUser
                              ? "No puedes modificar tu propio rol"
                              : ""
                          }
                        >
                          <input
                            type="checkbox"
                            checked={isAdmin}
                            disabled={isCurrentUser}
                            onChange={() => {
                              if (!isCurrentUser) {
                                toggleAdmin(user.email);
                              }
                            }}
                          />
                          <span className="slider"></span>
                        </label>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          <div className="results-info">
            Mostrando {users.length} de {users.length * totalPages} usuarios
          </div>
        </div>

        <div className="pagination-wrapper">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
}

export default UserList;
