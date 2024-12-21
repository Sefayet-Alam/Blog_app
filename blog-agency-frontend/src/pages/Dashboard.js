import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const API_BASE_URL = process.env.REACT_APP_API_URL;

if (!API_BASE_URL) {
  console.error("REACT_APP_API_URL environment variable is not set.");
}

const Dashboard = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [data, setData] = useState({ blogs: [], teams: [], services: [] });
  const [selectedEntity, setSelectedEntity] = useState("blogs"); // Default selection
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData(selectedEntity); // Pass selectedEntity as a dependency
    return () => {
      setData((prevData) => ({
        ...prevData,
        [selectedEntity]: [], // Clear data when switching sections
      }));
    };
  }, [token, selectedEntity]); // Fetch data whenever token or selectedEntity changes

  const fetchData = async (entity) => {
    if (!token) {
      console.error("Authorization token is missing!");
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/${entity}`, {
        headers: { Authorization: `${token}` },
      });

      setData((prevData) => ({
        ...prevData,
        [entity]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpenDialog = (entity, row = null) => {
    setCurrentRow(row);
    setFormData(row || {});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({});
    setCurrentRow(null);
  };

  const handleSave = async () => {
    if (!token) {
      console.error("Authorization token is missing!");
      return;
    }

    try {
      const url = currentRow
        ? `${API_BASE_URL}/${selectedEntity}/${currentRow._id}`
        : `${API_BASE_URL}/${selectedEntity}`;
      const method = currentRow ? "put" : "post";

      await axios[method](url, formData, {
        headers: { Authorization: `${token}` },
      });
      fetchData(selectedEntity); // Refresh data after saving
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!token) {
      console.error("Authorization token is missing!");
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/${selectedEntity}/${id}`, {
        headers: { Authorization: `${token}` },
      });
      fetchData(selectedEntity); // Refresh data after deleting
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const renderTable = (rows, columns) => (
    <TableContainer component={Paper} sx={{ marginTop: 4, marginBottom: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column}
                sx={{
                  fontWeight: "bold",
                  color: "#1976d2", // Apply color to the header text
                  fontSize: "1.1rem",
                  textTransform: "uppercase", // Make the column names more stylish
                }}
              >
                {column}
              </TableCell>
            ))}
            <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row._id}>
              {columns.map((column) => (
                <TableCell key={column}>
                  {column === "image" || column === "icon" ? (
                    <img
                      src={row[column]}
                      alt={column}
                      style={{ width: "50px", height: "50px" }}
                    />
                  ) : (
                    row[column]
                  )}
                </TableCell>
              ))}
              <TableCell>
                <Button onClick={() => handleOpenDialog(selectedEntity, row)}>Edit</Button>
                <Button color="error" onClick={() => handleDelete(row._id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const entityColumns = {
    blogs: ["title", "author", "image", "content"],
    teams: ["name", "role", "image", "bio"],
    services: ["name", "description", "icon"],
  };

  return (
    <Container className="dashboard">
      <Typography variant="h4" sx={{ marginBottom: 4, textAlign: "center", marginTop: 4 }}>
        Dashboard
      </Typography>

      <div style={{ marginBottom: "20px" }}>
        <Button
          variant="outlined"
          onClick={() => setSelectedEntity("blogs")}
          sx={{ marginRight: 2 }}
        >
          Blogs
        </Button>
        <Button
          variant="outlined"
          onClick={() => setSelectedEntity("teams")}
          sx={{ marginRight: 2 }}
        >
          Teams
        </Button>
        <Button
          variant="outlined"
          onClick={() => setSelectedEntity("services")}
          sx={{ marginRight: 2 }}
        >
          Services
        </Button>
      </div>

      <Button
        variant="contained"
        onClick={() => handleOpenDialog(selectedEntity)}
        sx={{ marginBottom: 4 }}
      >
        Create {selectedEntity.charAt(0).toUpperCase() + selectedEntity.slice(1)}
      </Button>

      {renderTable(data[selectedEntity], entityColumns[selectedEntity])}

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>{currentRow ? "Edit" : "Create"} {selectedEntity}</DialogTitle>
        <DialogContent>
          {entityColumns[selectedEntity].map((key) => (
            <TextField
              key={key}
              margin="dense"
              label={key}
              name={key}
              value={formData[key] || ""}
              onChange={handleInputChange}
              fullWidth
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
