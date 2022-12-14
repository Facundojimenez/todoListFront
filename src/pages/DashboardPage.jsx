import { Container, Box } from "@mui/system";
import NavBar from "../components/NavBar";
import Stage from "../components/Stage";
import { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import StageAdder from "../components/StageAdder";
import EditIcon from "@mui/icons-material/Edit";
import { updateDashboardFromUser } from "../utils/updateData";
import { Stack, Typography, IconButton, Button, TextField, Dialog, Grid, DialogTitle, DialogContent, DialogContentText, DialogActions} from "@mui/material";
import { deleteDashboardFromUser } from "../utils/deleteData";
import DashboardSelector from "../components/DashboardSelector";
import styles from "../styles/styles";

export default function  DashboardPage()  {
  const { user, setUser, currentDashboard, setCurrentDashboard } =
  useContext(UserContext);
  const [open, setOpen] = useState(false);

  let formData = currentDashboard;

  const updateDashboard = async () => {
    formData.dashboardId = parseInt(formData._id);
    formData.userId = user._id;
    const updatedUser = await updateDashboardFromUser(formData);

    setUser(updatedUser);
    setOpen(false);
  };

  const deleteDashboard = async () => {
    const updatedUser = await deleteDashboardFromUser(
      user._id,
      currentDashboard._id
    );
    if (updatedUser.dashboards.length > 0) {
      setCurrentDashboard(updatedUser.dashboards[0]);
    } else {
      setCurrentDashboard(null);
    }
    setUser(updatedUser);
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    formData = { ...formData, [event.target.id]: event.target.value };
  };

  if (currentDashboard) {
    return (
      <>
        <Box sx={styles.dashboardPage.dashboardContainer}>
          <NavBar />
          <Typography sx={styles.dashboardPage.title} variant="h2" align="center">
            {currentDashboard.title}
            <IconButton size="large" onClick={handleClickOpen}>
              <EditIcon />
            </IconButton>
          </Typography>
          <Container sx={styles.dashboardPage.stagesContainer} maxWidth="false">
            <Stack direction="row" justifyContent="flex-start" alignItems="stretch"  spacing={2} >
              {
								!currentDashboard.stages ? "loading" : currentDashboard.stages.map((stage) => {
                    return <Stage stageId={stage._id} key={stage._id} />;
                })
							}
              <StageAdder />
            </Stack>
          </Container>
        </Box>

				{/* form que se abre */}
				<Dialog open={open} onClose={handleClose} fullWidth={true}  maxWidth="sm" >
					<DialogTitle>Editar dashboard</DialogTitle>
					<DialogContent>
						<DialogContentText>Titulo:</DialogContentText>
						<TextField autoFocus margin="dense" id="title" defaultValue={currentDashboard.title} type="text" fullWidth variant="standard" onChange={handleInputChange}/>
					</DialogContent>
					<DialogActions>
						<Grid container>
							<Grid item xs={4} justifyContent="space-between">
								<Button variant="outlined" color="error" onClick={deleteDashboard} >
									Eliminar
								</Button>
							</Grid>
							<Grid item xs={8}>
								<Box display="flex" justifyContent="flex-end">
									<Button onClick={handleClose}>Cancelar</Button>
									<Button onClick={updateDashboard}>Guardar</Button>
								</Box>
							</Grid>
						</Grid>
					</DialogActions>
				</Dialog>
      </>
    );
  } else {
    return (
      <>
        <NavBar />
        <Box sx={styles.dashboardPage.noDashboardContainer}>
          <Typography variant="h2" align="center">No hay dashboards creados</Typography>
          <DashboardSelector />
        </Box>
      </>
    );
  }
};

