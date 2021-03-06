import React, {useEffect, useState} from 'react';
import { RestService } from '../../Service/RestService'
import {Paper} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableFooter from "@material-ui/core/TableFooter";
import VenderAccionesButton from './VenderAccionesButton';
import {TablePaginationActions } from "../Common/Table.jsx";
import { tableStyle, StyledTableCell, StyledTableRow  } from '../MaterialDesign/Styles';

export default function AccionesTable(props) {
    const [acciones, handleAcciones] = useState([])
    const [pagina, setPagina] = React.useState(0);
    const [accionesPorPagina, setAccionesPorPagina] = React.useState(5);
    const classes = tableStyle();
    const emptyRows = accionesPorPagina - Math.min(accionesPorPagina, acciones.length - pagina * accionesPorPagina);
    const usuarioId = !!props.usuario ? props.usuario.id : '';

    const handleChangePage = (event, newPage) => {
        setPagina(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setAccionesPorPagina(parseInt(event.target.value, 10));
        setPagina(0);
    };

    useEffect(() => {
        RestService.GET.findAccionesByUser(usuarioId)
            .then(response => handleAcciones(response.data))
    }, [usuarioId])

    return (
         <div className="container row justify-content-center">
             <TableContainer component={Paper}>
                 <Table className={classes.table} aria-label="custom pagination table">
                     <TableHead>
                         <TableRow>
                             <StyledTableCell align="center">Empresa</StyledTableCell>
                             <StyledTableCell align="center">Cantidad</StyledTableCell>
                             <StyledTableCell align="center">Fecha Última Compra</StyledTableCell>
                             <StyledTableCell align="center"></StyledTableCell>
                         </TableRow>
                     </TableHead>
                     <TableBody>
                         {renderAcciones()}
                         {emptyRows > 0 && (
                             <TableRow style={{ height: 53 * emptyRows }}>
                                 <StyledTableCell colSpan={6} />
                             </TableRow>
                         )}
                     </TableBody>
                 </Table>
                 <TableFooter>
                     <TableRow>
                         <TablePagination
                             rowsPerPageOptions={[5, 10]}
                             colSpan={3}
                             count={acciones.length}
                             rowsPerPage={accionesPorPagina}
                             page={pagina}
                             SelectProps={{
                                 inputProps: { 'aria-label': 'rows per pagina' },
                                 native: true,
                             }}
                             onChangePage={handleChangePage}
                             onChangeRowsPerPage={handleChangeRowsPerPage}
                             ActionsComponent={TablePaginationActions}
                         />
                     </TableRow>
                 </TableFooter>
             </TableContainer>
         </div>
    )

    function renderAcciones() {
        return (accionesPorPagina > 0
            ? acciones.slice(pagina * accionesPorPagina, pagina * accionesPorPagina + accionesPorPagina)
            : acciones).map((row) => (
                <StyledTableRow>
                    <StyledTableCell align="center">{row.empresa.nombreEmpresa}</StyledTableCell>
                    <StyledTableCell align="center">{row.cantidad}</StyledTableCell>
                    <StyledTableCell align="center">{row.fechaUltimaCompra}</StyledTableCell>
                    <StyledTableCell align="center">{<VenderAccionesButton usuario = {props.usuario} empresa = {row.empresa.nombreEmpresa} />}</StyledTableCell>
                </StyledTableRow>
        ))
    }
}
