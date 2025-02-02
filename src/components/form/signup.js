import React, { Component } from 'react'
import styled from 'styled-components'
import Cookies from 'js-cookie'
import PropTypes from 'prop-types'
import Row from '../containers/row'
import { Header, Text } from '../elements/typography'
import { localize, Localize } from '../localization'
import Image from '../elements/image'
import Wrapper from '../containers/wrapper'
import Button from './button'
import Input from './input'
import TrafficSource from 'common/traffic-source'
import { LocalStore } from 'common/storage'
import { BinarySocketBase } from 'common/websocket/socket_base'
import Login from 'common/login'
import { StyledLink } from 'components/elements/link'
// Icons
import Facebook from 'images/svg/facebook.svg'
import Google from 'images/svg/google.svg'

const Form = styled.form`
    width: 80%;
    margin: 0 auto;
`
const ResponseWrapper = styled.div`
    justify-content: center;
    max-width: 33rem;
    margin: 0 auto;
    flex-direction: column;
    padding: 2rem 1rem;
`
const InputGroup = styled.div`
    position: relative;
    width: 100%;
    margin: var(--text-size-m) 0;
`
const EmailButton = styled(Button)`
    width: 100%;
    font-size: 1.4rem;
    margin-bottom: 2rem;
`

const SocialButton = styled(Button)`
    box-shadow: none;
    flex: inherit !important;
    width: 48%;
`
const MutedText = styled(Text)`
    text-align: left;
    color: var(--color-grey);
    align-self: start;
`
const SocialWrapper = styled(Row)`
    width: 100%;
    justify-content: space-between;
    margin-top: var(--text-size-s);
`
export const LoginText = styled(MutedText)`
    text-align: center;
    align-self: center;
    margin-top: 4rem;
    margin-bottom: 8rem;
`
const LoginLink = styled.a`
    color: var(--color-red);
    text-decoration: none;
    cursor: pointer;
`
const EmailImgWrapper = styled(Wrapper)`
    display: flex;
    justify-content: center;
`
const EmailLink = styled(StyledLink)`
    display: table;
    font-size: 1.4rem;
    margin-top: 1.8rem;
    text-decoration: underline;
    width: 100%;
`

const validateEmail = email => {
    const required = email.length
    const valid = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/.test(
        email,
    )

    if (!required) return localize('Email is required')
    if (!valid) return localize('Invalid email address')

    return null
}

class Signup extends Component {
    state = {
        email: '',
        is_submitting: false,
        email_error_msg: '',
        submit_status: '',
        submit_error_msg: '',
    }

    handleValidation = param => {
        const message = typeof param === 'object' ? param.target.value : param

        this.setState({
            email_error_msg: validateEmail(message),
        })
    }

    handleInputChange = e => {
        const { name, value } = e.target

        this.setState({
            [name]: value,
        })

        this.handleValidation(value)
    }

    getVerifyEmailRequest = email => {
        const utm_data = TrafficSource.getData()
        const affiliate_token = Cookies.getJSON('affiliate_tracking')
        const signup_device = LocalStore.get('signup_device')
        const date_first_contact = LocalStore.get('date_first_contact')
        const gclid = LocalStore.get('gclid')

        return {
            verify_email: email,
            type: 'account_opening',
            url_parameters: {
                utm_source: TrafficSource.getSource(utm_data),
                ...(utm_data.utm_campaign && {
                    utm_medium: utm_data.utm_medium,
                    utm_campaign: utm_data.utm_campaign,
                }),
                ...(affiliate_token && { affiliate_token: affiliate_token.t }),
                ...(gclid && { gclid_url: gclid }),
                ...(signup_device && { signup_device: signup_device }),
                ...(date_first_contact && {
                    date_first_contact: date_first_contact,
                }),
            },
        }
    }

    handleEmailSignup = e => {
        e.preventDefault()
        this.setState({ is_submitting: true })
        const { email, email_error_msg } = this.state

        this.handleValidation(email)

        const has_error_email = validateEmail(email)

        if (has_error_email || email_error_msg) {
            return this.setState({ is_submitting: false })
        }

        const verify_email_req = this.getVerifyEmailRequest(email)
        BinarySocketBase.send(verify_email_req).then(response => {
            if (response.error) {
                return this.setState({
                    is_submitting: false,
                    submit_status: 'error',
                    submit_error_msg: response.error.message,
                })
            }

            this.setState({
                is_submitting: false,
                submit_status: 'success',
            })
        })
    }

    clearEmail = () => this.setState({ email: '', email_error_msg: '' })

    handleSocialSignup = e => {
        e.preventDefault()
        Login.initOneAll(e.target.id)
    }

    handleLogin = e => {
        e.preventDefault()
        Login.redirectToLogin()
    }

    render() {
        return (
            <>
                {!this.state.submit_status && (
                    <Form onSubmit={this.handleEmailSignup} noValidate>
                        <Header as="h3" weight="normal">
                            {localize('Sign up for free now!')}
                        </Header>
                        <InputGroup>
                            <Input
                                id="email"
                                name="email"
                                type="text"
                                error={this.state.email_error_msg}
                                value={this.state.email}
                                label={localize('Email')}
                                placeholder={'example@mail.com'}
                                handleError={this.clearEmail}
                                onChange={this.handleInputChange}
                                onBlur={this.handleValidation}
                                autoFocus={this.props.autofocus}
                                autoComplete="off"
                                required
                            />
                        </InputGroup>
                        <EmailButton
                            type="submit"
                            secondary
                            disabled={this.state.is_submitting}
                        >
                            {localize('Create a free account')}
                        </EmailButton>
                        <Text color="grey">{localize('Or sign up with')}</Text>
                        <SocialWrapper>
                            <SocialButton
                                onClick={this.handleSocialSignup}
                                provider="google"
                                id="google"
                                type="button"
                                social
                            >
                                <span>
                                    <Google />
                                </span>
                            </SocialButton>
                            <SocialButton
                                onClick={this.handleSocialSignup}
                                provider="facebook"
                                id="facebook"
                                type="button"
                                social
                            >
                                <span>
                                    <Facebook />
                                </span>
                            </SocialButton>
                        </SocialWrapper>
                        <LoginText>
                            {localize('Already have an account?')}
                            <LoginLink onClick={this.handleLogin}>
                                {' '}
                                {localize('Log in.')}
                            </LoginLink>
                        </LoginText>
                    </Form>
                )}
                {this.state.submit_status === 'success' && (
                    <ResponseWrapper>
                        <Header as="h3" align="center" weight="normal">
                            {localize('Check your email')}
                        </Header>
                        <EmailImgWrapper
                            width="100%"
                            margin={{ top: '1rem', bottom: '1.6rem' }}
                        >
                            <Image
                                img_name="view-email.png"
                                alt="Email image"
                                width="80%"
                            />
                        </EmailImgWrapper>
                        <Text align="center">
                            <Localize
                                translate_text="We've sent a message to {{email}} with a link to activate your account."
                                values={{ email: this.state.email }}
                            />
                        </Text>
                        <EmailLink to="/check-email/">
                            {localize("Didn't receive your email?")}
                        </EmailLink>
                    </ResponseWrapper>
                )}
                {this.state.submit_status === 'error' &&
                    this.state.submit_error_msg && (
                        <ResponseWrapper>
                            <Text align="center">
                                {this.state.submit_error_msg}
                            </Text>
                        </ResponseWrapper>
                    )}
            </>
        )
    }
}

Signup.propTypes = {
    autofocus: PropTypes.bool,
}

export default Signup
