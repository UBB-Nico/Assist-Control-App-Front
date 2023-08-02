import axios from 'axios';

export class EmployeeService{

    url="http://localhost:8001/employee/";

    getAll(){
        return axios.get(this.url +"all").then(res => res.data);
    }

    saveEmployee(employee){
        return axios.post(this.url + "save", employee).then(res => res.data);
    }

    deleteEmployee(empId){
        return axios.delete(this.url + "delete/"+empId).then(res => res.data);
    }
};