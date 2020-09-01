import React, { Component } from 'react'
import { FormControl, InputGroup, Card, Col, Row, Container, Button, Form } from 'react-bootstrap';
// import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { InputNumber } from "antd";

import DatePicker from 'react-date-picker';
// import GeoCode from '../components/GeoCode';
import Input from '../components/InputComponent';
import LocationSearchInput from'../components/LocationSearchInput';

export default class MaxRefi extends Component {

    constructor(props){
        super(props)
        this.state = {
        purchasePrice: 0,
        requestLoanAmount: 0,
        annualGrossRent: 0,
        units: 0,
        taxes: 0,
        insurance: 0,
        waterSewer: 0,
        utilities: 0,
        hardCosts: 0,
        softCosts: 0,
        rate: 0,
        arm: 0,
        payoff: 0,
        }
        this.baseState = this.state 
    }

    resetForm = () => {
        this.setState(this.baseState)
        this.props.clearAddressFromState()

    }

    handleNumberChange= (key, e) =>{
        this.setState({
          [key]: parseInt(e)
        })
    }

    handleRateChange=(rate, e)=>{
        this.setState({ rate: e})
    }

    // myFormat(num) {
    //     return num + '$';
    // }

    createLoan=(address,properyType, date, loan,officeExpenses,replacementReserves,management,vacancy,totalProjectCost,noi,capRate,annualDebtService,dscr)=>{
        if (address !== ""){
          fetch('https://snco-calculator-backend.herokuapp.com/loans',{
            method: "POST",
            headers:{'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({address: address,
                purchaseDate: date,
                properyType: properyType, 
                loan,
                officeExpenses,replacementReserves,management,vacancy,totalProjectCost,noi,capRate,annualDebtService,dscr
            })
          })
          .then(res=>res.json())
          .then(loans=>this.resetForm())
          .catch(() => console.log("Can’t POST loan data"))
    
        } else {
          console.log("wont post without an address")
        }
    }


    render() {
        
        let officeExpenses = (this.state.units ) * 500
        let replacementReserves = (this.state.units  ) * 250
        
        let management = (this.state.annualGrossRent * .04)
        let vacancy = (this.state.annualGrossRent * .03)
        
        let taxes = (this.state.taxes )
        let utilities = (this.state.utilities )
        let waterSewer = (this.state.waterSewer )
        
        let totalProjectCost  = (this.state.purchasePrice + this.state.hardCosts + this.state.softCosts);
        
        let grossAnnualIncome = ( this.state.annualGrossRent );
        let grossAnnualOperatingExpenses = (taxes + utilities + waterSewer + management);
        let effectiveAnnualGross = grossAnnualIncome - vacancy
        let noi = (grossAnnualIncome - grossAnnualOperatingExpenses);
        let capRate = ((noi / totalProjectCost) * 100)
        
        let requestLoanAmount = this.state.requestLoanAmount? this.state.requestLoanAmount : 0;
        let ratePercent = this.state.rate? (this.state.rate / 100) : 0;
        let arm = this.state.arm ? this.state.arm : 1;
        
        let annualDebtService = ((requestLoanAmount + (requestLoanAmount * ratePercent))/ arm)
        let dscr = noi / annualDebtService
        
        return (

                <Container fluid>
                    <Row>

                        <Col md={7}>
                            <Card style={{ border: '2px solid #B98757', margin: "1rem", borderRadius: 15  }}>
                                <Card.Body>
                                <Form>
                                
                                    {/* <GeoCode handleAddressChange={this.props.handleAddressChange}></GeoCode> */}
                                    <LocationSearchInput 
                                        handleAddressChange={this.props.handleAddressChange} 
                                        address={this.props.address} 
                                        // handleAddressSelect={this.props.handleAddressSelect}
                                    />
                                <Form.Row>
                                    <Col>
                                    <InputGroup className="mb-3">
                                        <Form.Label>Units</Form.Label>
                                        <Input name="units" value={this.state.units || undefined} type="number" handleChange={this.handleNumberChange}/>
                                    </InputGroup>
                                    </Col>
                                    <Col>
                                    <InputGroup className="mb-3">
                                    <Form.Label style={{width: "100%", textAlign: "left"}}>Purchase Date</Form.Label>
                                        <DatePicker
                                            onChange={this.props.dateChange}
                                            value={this.props.date}
                                        />
                                    </InputGroup>
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col>
                                    <InputGroup className="mb-3">
                                        <Form.Label>Puchase Price</Form.Label>
                                        <Input
                                            handleChange={this.handleNumberChange}
                                            value={this.state.purchasePrice}
                                            name={"purchasePrice"}
                                            input="currency"
                                        />
                                    </InputGroup>
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col>
                                        <InputGroup className="mb-3">
                                            <Form.Label>Hard Costs</Form.Label>
                                            <Input
                                                handleChange={this.handleNumberChange}
                                                value={this.state.hardCosts}
                                                name={"hardCosts"}
                                                input="currency"
                                            /> 
                                        </InputGroup>
                                    </Col>
                                    <Col>   
                                        <InputGroup className="mb-3">                                    
                                            <Form.Label>Soft Costs</Form.Label>
                                            <Input
                                                handleChange={this.handleNumberChange}
                                                value={this.state.softCosts}
                                                name={"softCosts"}
                                                input="currency"
                                            />                                    
                                        </InputGroup>
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col>
                                        <InputGroup className="mb-3">
                                            <Form.Label>Payoff</Form.Label>
                                            <Input
                                                handleChange={this.handleNumberChange}
                                                value={this.state.payoff}
                                                name={"payoff"}
                                                input="currency"
                                            /> 
                                        </InputGroup> 
                                    </Col> 
                                    <Col>
                                        <InputGroup className="mb-3">                                     
                                            <Form.Label>Annual Gross Rent</Form.Label>
                                            <Input
                                                handleChange={this.handleNumberChange}
                                                value={this.state.annualGrossRent}
                                                name={"annualGrossRent"}
                                                input="currency"
                                            />                                        
                                        </InputGroup>
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col>
                                        <InputGroup className="mb-3">
                                        <Form.Label>Vacancy</Form.Label>
                                            <Input
                                                handleChange={this.handleNumberChange}
                                                value={ vacancy }
                                                name={"vacancy"}
                                                disabled={true}
                                                input="currency"
                                            /> 
                                        </InputGroup> 
                                    </Col> 
                                    <Col>
                                        <InputGroup className="mb-3">                                                    
                                        <Form.Label>Taxes</Form.Label>
                                            <Input
                                                handleChange={this.handleNumberChange}
                                                value={this.state.taxes}
                                                name={"taxes"}
                                                input="currency"
                                            />                                      
                                        </InputGroup>
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col>
                                        <InputGroup className="mb-3">
                                            <Form.Label>Utilities</Form.Label>
                                            <Input
                                                handleChange={this.handleNumberChange}
                                                value={this.state.utilities}
                                                name={"utilities"}
                                                input="currency"
                                            /> 
                                        </InputGroup> 
                                    </Col> 
                                    <Col>
                                        <InputGroup className="mb-3">                                                
                                            <Form.Label>Insurance</Form.Label>
                                            <Input
                                                handleChange={this.handleNumberChange}
                                                value={this.state.insurance}
                                                name={"insurance"}
                                                input="currency"
                                            />                                    
                                        </InputGroup>
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col>
                                        <InputGroup className="mb-3">
                                            <Form.Label>Water Sewer</Form.Label>
                                            <Input
                                                handleChange={this.handleNumberChange}
                                                value={this.state.waterSewer}
                                                name={"waterSewer"}
                                                input="currency"
                                            />     
                                        </InputGroup> 
                                    </Col> 
                                    <Col>
                                        <InputGroup className="mb-3">                                          
                                            <Form.Label>Management</Form.Label>
                                            <Input
                                                handleChange={this.handleNumberChange}
                                                value={ management }
                                                name={"management"}
                                                disabled={true}
                                                input="currency"
                                            />                                          
                                        </InputGroup>
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col>
                                        <InputGroup className="mb-3">
                                            <Form.Label>Replacement Reserves</Form.Label>
                                            <Input
                                                handleChange={ this.handleNumberChange }
                                                value={ replacementReserves }
                                                name={"replacementReserves"}
                                                disabled={true}
                                                input="currency"
                                            />  
                                        </InputGroup> 
                                    </Col> 
                                    <Col>
                                        <InputGroup className="mb-3" >                                         
                                            <Form.Label>Loan Amount</Form.Label>
                                            <Input
                                                handleChange={this.handleNumberChange}
                                                value={this.state.requestLoanAmount}
                                                name={"requestLoanAmount"}
                                                input="currency"
                                            />                                     
                                        </InputGroup>
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col>
                                        <InputGroup className="mb-3">
                                            <Form.Label>ARM</Form.Label>
                                            <Input type="number" name="arm" value={ this.state.arm } handleChange={this.handleNumberChange}/>
                                        </InputGroup>
                                    </Col>
                                    <Col>
                                        <InputGroup className="mb-3">
                                            <Form.Label style={{width: "100%", textAlign: "left"}}>Rate</Form.Label>
                                                {/* <PercentageInput
                                                    handleChange={ this.handleNumberChange }
                                                    value={this.state.rate}
                                                    name={"rate"}
                                                /> */}
                                                <InputNumber
                                                    name={"rate"}
                                                    formatter={value => `${value}%`}
                                                    parser={value => value.replace('%', '')}
                                                    style={{ width: "35%",fontSize: 17, paddingTop: 3 }}
                                                    value={this.state.rate? this.state.rate : 0} 
                                                    min={0}
                                                    max={100}
                                                    onChange={e => this.handleRateChange("rate", e)}
                                                />
                                        </InputGroup>
                                    </Col>
                                </Form.Row>
                                </Form>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={5}>
                            <Card style={{  border: '2px solid #B98757', margin: "1rem", borderRadius: 15 }}>
                                <Card.Body style={{textAlign: "left", fontWeight: "600"}}>
                                <Form>
                                <Form.Row>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Prepend>
                                        <InputGroup.Text style={{fontWeight: "600"}}>Gross Annual Income: </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Input
                                            value={ grossAnnualIncome? grossAnnualIncome.toFixed(2) : 0}
                                            disabled={true}
                                            input="currency"
                                        />
                                    </InputGroup>
                                </Form.Row>
                                <Form.Row>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Prepend>
                                        <InputGroup.Text style={{fontWeight: "600"}}>NOI:</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Input
                                            value={ noi? noi.toFixed(2) : 0}
                                            disabled={true}
                                            input="currency"
                                        />
                                    </InputGroup>
                                </Form.Row>
                                <Form.Row>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Prepend>
                                        <InputGroup.Text style={{fontWeight: "600"}}>Annual Debt Service:</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Input
                                            value={ annualDebtService? annualDebtService.toFixed(2) : 0}
                                            disabled={true}
                                            input="currency"
                                        />
                                    </InputGroup>
                                </Form.Row>
                                <Form.Row>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Prepend>
                                        <InputGroup.Text style={{fontWeight: "600"}}>Debt Service Coverage Ratio (DSCR):</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Input
                                            value={dscr? dscr.toFixed(2) : 0}
                                            disabled={true}
                                            input="percent"
                                        />
                                    </InputGroup>
                                </Form.Row>
                                </Form>
                                </Card.Body>
                            </Card>
                            <Button 
                                variant="outline-dark" 
                                style={{ marginBottom: 15 }} 
                                onClick={()=>this.createLoan(this.props.address, this.props.propertyType, this.props.date, this.state, officeExpenses,replacementReserves,management,vacancy,totalProjectCost,noi,capRate,annualDebtService,dscr)}
                            >Save</Button>                        
                        </Col>
                    </Row>

                </Container>
                
        )
    }
}

{/* <Form.File

    FOR UPLOADING FILES

    className="position-relative"
    required
    name="file"
    label="File"
    onChange={handleChange}
    isInvalid={!!errors.file}
    feedback={errors.file}
    id="validationFormik107"
    feedbackTooltip
/>  */}