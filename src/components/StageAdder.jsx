import { useState, useContext, useEffect } from 'react';
import { Dialog, DialogTitle, Button, DialogContent, Card,Typography,DialogContentText, DialogActions, TextField,} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {actualizarCamposForm} from  "../utils/formFunctions"
import { createStageFromDashboard } from "../utils/createData";
import UserContext from "../context/UserContext"
import styles from '../styles/styles';
import Grow from '@mui/material/Grow';


export default function StageAdder() {
  const {addStageRender, currentDashboard} = useContext(UserContext)
  const [open, setOpen] = useState(false);
  const [StageData, setStageData] = useState({
    title: "",
    order: "",
    dashboardId: currentDashboard._id,
    tasks: []
  } )

  useEffect(() => {
    setStageData({
      title: "",
      order: "",
      dashboardId: currentDashboard._id,
      tasks: []
    })
  }, [currentDashboard])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) =>{
    actualizarCamposForm(event, StageData, setStageData);
  };

  const createStage = async () =>{
    const newStage = await createStageFromDashboard(StageData);
    handleClose();
    addStageRender(newStage)
    setStageData({title: "", description: ""})
  }

  return (
    <>
      {/* tarea */}
      <Grow in={true}>
        <Card sx={styles.stageAdder}>
            <Button sx={{padding: "1em"}} fullWidth variant="contained" color="primary" onClick={handleClickOpen} startIcon={<AddIcon/>}>
              <Typography>
                Agregar Stage
              </Typography>
            </Button>
        </Card>
      </Grow>

      {/* Menu que se abre */}
      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="sm">
        <DialogTitle>Crear Stage</DialogTitle>
          <DialogContent>
            <DialogContentText>
                Titulo del stage:
            </DialogContentText>
            <TextField autoFocus margin="dense" id="title" defaultValue={StageData.title} type="text" fullWidth variant="standard" onChange={handleInputChange}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={createStage}>Guardar</Button>
        </DialogActions>
      </Dialog>

    </>
  );
}