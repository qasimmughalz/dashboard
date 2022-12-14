
import axios from "axios"
import { useEffect, useState } from "react"
import { Sidebar } from "../../Layout/Sidebar/Sidebar"
import { TopNav } from "../../../Components/TopNav/TopNav"
import { useSelector } from "react-redux"
import './PaymentPlan.css'
import cardImage from '../../../assets/images/card.svg'
import { Spinner } from "../../../Components/Spinner/Loader"
import { useNavigate, useParams } from "react-router-dom"
import { isAllOf } from "@reduxjs/toolkit"

export const PaymentPlans = () => {


    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    const navbarShow = useSelector(state => state.navbarToggle.show)
    const [paymentPlans, setPaymentPlans] = useState([])
    const [anyError, setanyErrorMessage] = useState(false)

    const getToken= localStorage.getItem('token')

    useEffect(() => {

        const fetchData = async () => {
            setIsLoading(true)
            await axios({
                method: 'GET',
                url: `https://plugin-nodejs-server.herokuapp.com/api/getPlans`,
                data: {},
                headers: {
                    "authorization": `Bearer ${getToken}`
                },
            }).then((res) => {
                setIsLoading(false)
                setPaymentPlans(res.data)
                console.log("Response from Api", res)
            }).catch((e) => {
                setIsLoading(false)
                console.log("Error", e)
            })
        }
        fetchData()
    }, [])



    const onclickHandler = (id) => {
        console.log("id", id)
        const email = localStorage.getItem('email')
        const domain = localStorage.getItem('domain')
        const getToken = localStorage.getItem('token')

        if (domain === null) {
            setanyErrorMessage(true)
            return
        } else {
            setanyErrorMessage(false)
            const apiCall = async () => {
                const response = await axios({
                    method: 'POST',
                    url: 'https://plugin-nodejs-server.herokuapp.com/api/createSession',
                    data: { email: email, priceId: id, domainName: domain },
                    headers: {
                        "authorization": `Bearer ${getToken}`
                    }
                }).then((res) => {
                    console.log('response', res)
                    window.location.replace(res.data)
                }).catch(e => {
                    console.log(e)
                })
            }
            apiCall()
        }

    }


    return (
        <div className="wrapper">
            <div className="dashboard-wrapper">
                <div className={navbarShow ? 'sidebar px-md-3' : 'sidebar show px-md-3'} >
                    <Sidebar> </Sidebar>
                </div>
                <div className="right-content">
                    <div className="content">

                        <TopNav />
                        {/* =============== Inner Section Start ============= */}

                        <div className="container-fluid mt-5">


                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Pricing Plans</h1>
                            </div>

                            {/* //========= Error Message ======== */}

                            <div className="alert alert-warning alert-dismissible fade show" role="alert" style={{ display: anyError ? 'block' : 'none' }}>
                                <strong>Please Select Existing Domain or Add New One </strong>
                                <button type="button" className="close" onClick={() => setanyErrorMessage(!anyError)} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>



                            <div className="row justify-content-center">

                                {paymentPlans.length > 0 ? (paymentPlans.map((data) => {
                                    return (<div className="col-lg-3 col-md-6 col-9 mb-3" key={data.id}>
                                        <div className="card py-4  h-100">
                                            <div className="card-body d-flex flex-column">
                                                <div className="text-center">
                                                    <img src={cardImage} className="img-fluid  mb-5" alt="Websearch" style={{ height: '100px' }} />
                                                </div>
                                                <div className="card-title  mb-4 text-center fs-2">{data.name}</div>
                                                <div className="text-center mt-auto mb-4">
                                                    <span className="font-weight-bold fs-2 card-price">${data.price}</span>/{data.interval}
                                                </div>

                                                <div className="text-center"><button type="submit" onClick={() => onclickHandler(data.id)} value='submit' className="btn btn-primary">Choose Plan</button></div>
                                            </div>
                                        </div>
                                    </div>)
                                })) : <Spinner color='#1f38fa'></Spinner>
                                }

                            </div>
                        </div>
                        {/* =============== Inner Section End ============= */}
                    </div>
                </div>
            </div>
        </div>


    )
}