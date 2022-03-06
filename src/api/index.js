import api from '../plugins/axios'

export const createPrescription = async (prescription) => await api.post('http://localhost:38902/prescriptions/create', prescription)

async function removePrescriptionById  (id) {return await api.del(`http://localhost:38902/prescriptions/remove/${id}`)}

export {
    removePrescriptionById
}

export const updatePrescriptionById = async (id, prescription) => await api.put(`http://localhost:38902/prescriptions/update/${id}`,{}, prescription)

export const retrievePrescriptions = async (query = {page: 1, pageSize: 10}) => await api.get(`http://localhost:38902/prescriptions/retrieveList`, query)

export const retrievePrescriptionById = async(id) => await api.get(`http://localhost:38902/prescriptions/retrieve/${id}`)