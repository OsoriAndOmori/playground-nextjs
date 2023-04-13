import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {readdirSync} from 'fs';
import path from 'path';
import Copyright from '../src/component/Copyright';
import Image from "next/image";
import Head from "next/head";

interface Props {
    images: string[]
}

export function getStaticProps() {
    const directory = path.join(process.cwd(), 'public', 'images', 'osori-family');
    const images = readdirSync(directory);

    return {
        props: {images: images}, // will be passed to the page component as props
    }
}

const Home = (props: Props) => {
    return (
        <>
            <Head>
                <title>오소리 하우스</title>
                <meta property="og:title" content="오소리 하우스"/>
                <meta property="og:image"
                      content="https://playground-nextjs-osori.vercel.app/images/osori-family/osori-daughter-1.jpg"/>
                <meta property="og:description" content="김나린 김나율의 집 입니다."/>
            </Head>
            <Container maxWidth="lg">
                <Box
                    sx={{
                        my: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom>
                        오소리 하우스 만드는 중
                    </Typography>
                    <Copyright/>
                </Box>
                {props.images.map(filename => <Image key={'home-image-' + filename}
                                                     src={'/images/osori-family/' + filename} alt={""} width={200}
                                                     height={200}/>)}
            </Container>
        </>
    );
};
export default Home
