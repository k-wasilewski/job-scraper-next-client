import React from "react";
import AuthForm, { AuthFormType } from "../components/AuthForm";
import getConfig from "next/config";

export function getStaticProps() {
    const {publicRuntimeConfig} = getConfig();
    const nodeServerHost = publicRuntimeConfig?.nodeServerHost || null;

    return { props: { nodeServerHost } };
}

interface LoginProps {
    nodeServerHost: string | null;
}

export default function Login(props: LoginProps) {
    const {nodeServerHost} = props;

    return (
        <AuthForm type={AuthFormType.Login} nodeServerHost={nodeServerHost}></AuthForm>
    );
}
