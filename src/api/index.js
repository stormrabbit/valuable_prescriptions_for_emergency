import api from '../plugins/axios'

export const createPrescription = async (prescription) => await api.post('prescriptions/create', prescription)

async function removePrescriptionById  (id) {return await api.del(`prescriptions/remove/${id}`)}

export {
    removePrescriptionById
}

export const updatePrescriptionById = async (id, prescription) => await api.put(`prescriptions/update/${id}`,{}, prescription)

export const retrievePrescriptions = async (query = {page: 1, pageSize: 10}) => await api.get(`prescriptions/retrieveList`, query)

export const retrievePrescriptionById = async(id) => await api.get(`prescriptions/retrieve/${id}`)