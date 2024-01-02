import React from "react";
import getConfig from "next/config";
import AuthForm, { AuthFormType } from "../components/AuthForm";

export function getStaticProps() {
    const {publicRuntimeConfig} = getConfig();
    const nodeServerHost = publicRuntimeConfig.nodeServerHost || null;

    return { props: { nodeServerHost } };
}

interface RegisterProps {
    nodeServerHost: string | null;
}

export default function Register(props: RegisterProps) {
    const {nodeServerHost} = props;

    return (
        <AuthForm type={AuthFormType.Register} nodeServerHost={nodeServerHost}></AuthForm>
    );
}
