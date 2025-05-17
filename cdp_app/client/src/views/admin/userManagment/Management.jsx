import React, { useState, useEffect } from "react";
import {
  Container,
  ButtonGroup,
  Button
} from "react-bootstrap";
import axiosClient from "../../../axios-client";

// Import components
import StudentManagement from "./components/StudentManagement";
import TeacherManagement from "./components/TeacherManagement";
import AdminManagement from "./components/AdminManagement";
import UserFormModal from "./components/UserFormModal";

export default function Management() {
  const [activeRole, setActiveRole] = useState("student");
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [showModal, setShowModal] = useState(false);
  const [initialRole, setInitialRole] = useState("student");
  
  // Data states from backend
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [availableClassrooms, setAvailableClassrooms] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  
  // Loading states
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);

  // Load data from backend on component mount
  useEffect(() => {
    // Fetch classrooms and subjects
    const fetchClassroomsAndSubjects = async () => {
      try {
        const [classroomsResponse, subjectsResponse] = await Promise.all([
          axiosClient.get('/classrooms'),
          axiosClient.get('/subjects')
        ]);
        
        setAvailableClassrooms(classroomsResponse.data);
        setAvailableSubjects(subjectsResponse.data);
      } catch (error) {
        console.error('Error fetching classrooms/subjects:', error);
      }
    };

    // Fetch users data
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await axiosClient.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };
    
    // Fetch payments data
    const fetchPayments = async () => {
      setLoadingPayments(true);
      try {
        const response = await axiosClient.get('/payments');
        setPayments(response.data);
      } catch (error) {
        console.error('Error fetching payments:', error);
        // Set empty array to prevent errors when API fails
        setPayments([]);
      } finally {
        setLoadingPayments(false);
      }
    };
    
    fetchClassroomsAndSubjects();
    fetchUsers();
    fetchPayments();
  }, []);
  
  // Handle adding a new user
  const handleUserCreated = (newUser) => {
    setUsers(prev => [...prev, newUser]);
  };
  
  // Show user form with appropriate initial role
  const showUserForm = (role) => {
    setInitialRole(role);
    setShowModal(true);
  };

  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <ButtonGroup>
          {["student", "teacher", "admin"].map((role) => (
            <Button
              key={role}
              id="color"
              variant={activeRole === role ? "primary" : "outline-primary"}
              onClick={() => setActiveRole(role)}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {/* Render the appropriate management component based on active role */}
      {activeRole === "student" && (
        <StudentManagement 
          users={users}
          payments={payments}
          userSearch={userSearch}
          setUserSearch={setUserSearch}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          loadingUsers={loadingUsers}
          loadingPayments={loadingPayments}
          showUserForm={() => showUserForm('student')}
        />
      )}
      
      {activeRole === "teacher" && (
        <TeacherManagement 
          users={users}
          search={search}
          setSearch={setSearch}
          loadingUsers={loadingUsers}
          showUserForm={() => showUserForm('teacher')}
        />
      )}
      
      {activeRole === "admin" && (
        <AdminManagement 
          users={users}
          userSearch={userSearch}
          setUserSearch={setUserSearch}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          loadingUsers={loadingUsers}
          showUserForm={() => showUserForm('admin')}
        />
      )}
      
      {/* User Creation Modal */}
      <UserFormModal
        showModal={showModal}
        setShowModal={setShowModal}
        onUserCreated={handleUserCreated}
        availableClassrooms={availableClassrooms}
        availableSubjects={availableSubjects}
        initialRole={initialRole}
      />
    </Container>
  );
}
