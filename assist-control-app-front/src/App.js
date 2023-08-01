import './App.css';
import React, { Component } from 'react';
import { EmployeeService } from './service/EmployeeService';
import {DataTable} from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/viva-dark/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Panel } from 'primereact/panel';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';



export default class App extends Component{

  constructor(){
    super();
    this.state={
      visible : false,
      employee : {
        id : null,
        name : null,
        lastName: null,
        position : null,
        contract : null
      },
      selectedEmployee : {

      },
      headerDialog: ''
    };
    this.items=[{
          label : 'Añadir',
          icon: 'pi pi-fw pi-plus',
          command : () => {this.showSaveModal()},
        }, 
        {
          label : 'Editar',
          icon: 'pi pi-fw pi-pencil',
          command : () => {this.showEditModal()},
        }, {
          label : 'Eliminar',
          icon: 'pi pi-fw pi-trash',
          command : () => {this.deleteEmp()},
        }
      ];

    this.employeeService = new EmployeeService();
    this.saveEmp = this.saveEmp.bind(this);
    this.deleteEmp = this.deleteEmp.bind(this);
    this.footer = (
      <Button label="Guardar" severity="success" icon="pi pi-check" iconPos="right"onClick={this.saveEmp}/>
    );

  }
  //Rescatar los datos de la BDD
  componentDidMount(){
    this.employeeService.getAll().then(data => this.setState({empTable: data}));
  }

  //Guardar empleados nuevos
  saveEmp() {
    this.employeeService.saveEmployee(this.state.employee).then(data =>{
      this.setState({
        visible : false,
        employee : {
          id : null,
          name : null,
          lastName: null,
          position : null,
          contract : null
        }
      });
      this.employeeService.getAll().then(data => this.setState({empTable: data}));
    });
  }

  deleteEmp(){
    if(window.confirm("El empleado seleccionado con el nombre de: "+ this.state.selectedEmployee.name+" será eliminado. ¿Está seguro?")){
      this.employeeService.deleteEmployee(this.state.selectedEmployee.id).then(data => {
        this.employeeService.getAll().then(data => this.setState({empTable: data})).catch(error => console.log(error));
      });
      
    }
  }

  //Pagina principal
  render(){
    return(
      <div style={{width: '80%', margin: '0 auto', marginTop: '20px'}}>
        <Menubar model={this.items}></Menubar>
        <br></br>

        <Panel header={"Empleados"} style={{fontSize: '2em'}}>
          <p className="m-2">
            <DataTable removableSort
              emptyMessage="No se encontraron registros." 
              selectionMode='single' selection={this.state.selectedEmployee}
              onSelectionChange={e => this.setState({selectedEmployee: e.value})}
              paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} 
              value={this.state.empTable} >
                <Column field='id' header='Identificador' sortable style={{ width: '5%' }} > </Column>

                <Column field='name' header='Nombre' sortable style={{ width: '5%' }} 
                    filter filterPlaceholder='Buscar por nombre' filterMatchMode='contains'> </Column>

                <Column field='lastName' header='Apellido' sortable style={{ width: '5%' }} 
                    filter filterPlaceholder='Buscar por apellido' filterMatchMode='contains'> </Column>

                <Column field='position' header='Cargo' sortable style={{ width: '5%' }} 
                    filter filterPlaceholder='Buscar por cargo' filterMatchMode='contains'  > </Column>

                <Column field='contract' header='Contrato' sortable style={{ width: '5%' }}
                    filter  filterPlaceholder='Buscar por contrato' filterMatchMode='contains' > </Column>
            </DataTable>

          </p>
        </Panel>
        <Dialog header={this.state.headerDialog} visible={this.state.visible} style={{ width: '40%' }} footer={this.footer} onHide={() => this.setState({visible : false})}>
          <div className="flex flex-column gap-2">
            <label htmlFor="Nombre" style={{margin:'1em'}}>Nombre  </label><br></br>
            <InputText style={{width :'100%'}} placeholder="Juan" value={this.state.value} id='name' onChange={(e) => {
                let val = e.target.value;
                this.setState(prevState => {
                  let employee = Object.assign({}, prevState.employee)
                  employee.name = val;
                  return {employee};
              })}
            } />
          </div>
          <br></br>

          <div className="flex flex-column gap-2">
            <label htmlFor="Apellido" style={{margin:'1em'}}>Apellido  </label><br></br>
            <InputText style={{width :'100%'}} placeholder="Pérez" value={this.state.value} id='lastName' onChange={(e) => {
                let val = e.target.value;
                this.setState(prevState => {
                let employee = Object.assign({}, prevState.employee)
                employee.lastName = val;
                return {employee};
              })}
            } />
          </div>
          <br></br>

          <div className="flex flex-column gap-2">
            <label htmlFor="Cargo" style={{margin:'1em'}}>Cargo  </label><br></br>
            <InputText style={{width :'100%'}} placeholder="Chofer" value={this.state.value} id='position' onChange={(e) => {
              let val = e.target.value; 
              this.setState(prevState => {
              let employee = Object.assign({}, prevState.employee)
              employee.position = val;
              return {employee};
            })}} />
          </div>
          <br></br>

          <div className="flex flex-column gap-2">
            <label htmlFor="Contrato" style={{margin:'1em'}}>Contrato  </label><br></br>
            <InputText style={{width :'100%'}} placeholder="Jornada completa" value={this.state.value} id='contract' onChange={(e) => {
              let val = e.target.value; 
              this.setState(prevState => {
              let employee = Object.assign({}, prevState.employee)
              employee.contract = val;
              return {employee};
            })}}/>
          </div>
          <br></br>
        </Dialog>
      </div>

    );
  }

  showSaveModal(){
    this.setState({
      visible : true,
      employee : {
        id : null,
        name : null,
        lastName: null,
        position : null,
        contract : null
      },
      headerDialog:"Añadir empleado"
    })
  }

  showEditModal(){
    this.setState({
      visible : true,
      employee : {
        id : this.state.selectedEmployee.id,
        name : this.state.selectedEmployee.name,
        lastName: this.state.selectedEmployee.lastName,
        position : this.state.selectedEmployee.position,
        contract : this.state.selectedEmployee.contract
      },
      headerDialog:"Editar empleado"
      
    })
    console.log(this.state.selectedEmployee);
  }
}