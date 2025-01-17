import React from 'react'
import { useEffect, useState } from 'react';
import { getAllUserByCompanyIdService, QuitCompanyService } from '../../../service/userService';
import moment from 'moment';
import { PAGINATION } from '../../utils/constant';
import ReactPaginate from 'react-paginate';

import { toast } from 'react-toastify';
const ManageEmployer = () => {
    const [user, setUser] = useState({})
    const [dataUser, setdataUser] = useState([]);
    const [count, setCount] = useState('')
    const [numberPage, setnumberPage] = useState('')
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        setUser(userData)
        if (userData && userData.idCompany) {
            fetchAllUser(userData.idCompany)
        }


    }, [])
    let fetchAllUser = async (idCompany) => {
        let res = await getAllUserByCompanyIdService({
            limit: PAGINATION.pagerow,
            offset: 0,
            idCompany: idCompany
        })
        if (res && res.errCode === 0) {

            setdataUser(res.data);
            setCount(Math.ceil(res.count / PAGINATION.pagerow))
        }
    }

    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
        let arrData = await getAllUserByCompanyIdService({


            limit: PAGINATION.pagerow,
            offset: number.selected ,
            idCompany: user.idCompany

        })
        if (arrData && arrData.errCode === 0) {
            setdataUser(arrData.data)

        }
    }
    let handleQuitCompany = async (userId) => {
        let res = await QuitCompanyService(userId)
        if (res && res.errCode === 0) {
            toast.success("Thôi việc thành công !")
            let response = await getAllUserByCompanyIdService({
                limit: PAGINATION.pagerow,
                offset: numberPage,
                idCompany: user.companyId
            })
            if (response && response.errCode === 0) {

                setdataUser(response.data);
                setCount(Math.ceil(response.count / PAGINATION.pagerow))
            }
        } else {
            toast.error(res.errMessage)
        }
    }
    return (
        <div>
            <div className="col-12 grid-margin">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Danh sách nhân viên</h4>

                        <div className="table-responsive pt-2">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>
                                            STT
                                        </th>
                                        <th>
                                            Họ và Tên
                                        </th>
                                        <th>
                                            Số điện thoại
                                        </th>
                                        <th>
                                            Giới tính
                                        </th>
                                        <th>
                                            Ngày sinh
                                        </th>
                                        <th>
                                            Quyền
                                        </th>
                                        <th>
                                            Trạng thái
                                        </th>
                                        <th>
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataUser && dataUser.length > 0 &&
                                        dataUser.map((item, index) => {
                                            let date = moment.unix(item?.birthday / 1000).format('DD/MM/YYYY')
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1 + numberPage * PAGINATION.pagerow}</td>
                                                    <td>{`${item.firstName} ${item.lastName}`}</td>
                                                    <td>{item.phoneNumber}</td>
                                                    <td>{item.genderValue}</td>
                                                    <td>{date}</td>
                                                    <td>{item.roleValue}</td>
                                                    <td><label className={item.statusCode === 'S1' ? 'badge badge-success' : 'badge badge-danger'}>{item.statusValue}</label></td>
                                                    <td>
                                                       {user.id != item.userId &&  <a onClick={() => handleQuitCompany(item.userId)} style={{ color: '#4B49AC', cursor: 'pointer' }} >Thôi việc</a>}
                                                        &nbsp; &nbsp;
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <ReactPaginate
                        previousLabel={'Quay lại'}
                        nextLabel={'Tiếp'}
                        breakLabel={'...'}
                        pageCount={count}
                        marginPagesDisplayed={3}
                        containerClassName={"pagination justify-content-center pb-3"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        breakLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        activeClassName={"active"}
                        onPageChange={handleChangePage}
                    />
                </div>

            </div>
        </div>
    )
}

export default ManageEmployer
