import { useState, useEffect, useRef, useCallback } from 'react';
import * as React from 'react';
import './../styles/index.css';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import { links } from '../consts/vars';

const ListItem = (props: { children: any }) => {
    return <div className="listLink">{props.children}</div>;
};

/**
 * Converts a release date string from the format 'YYYY-MM-DD' to 'YYYY/MM/DD'.
 *
 * @param {string} input - The release date string in 'YYYY-MM-DD' format.
 * @returns {string} - The formatted release date string in 'YYYY/MM/DD' format.
 */

const parseReleaseDate = (input: string): string => {
    const temp = input.split('-');
    return `${temp[0]}/${temp[1]}/${temp[2]}`;
};

export function Head({ location, pageContext }: { location: Location; pageContext: Context }) {
    const { title, description } = { title: pageContext.title, description: pageContext.artist };
    return (
        <>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content="pop, music, art, artist, alternative, electronic, country, indie, acoustic" />
            <meta name="robots" content="index, follow" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <link
                rel="icon"
                type="image/png"
                href={pageContext.albumArt.images.fallback ? pageContext.albumArt.images.fallback.src : ''}
                sizes="16x16"
            />
            <meta name="language" content="English" />
            <meta name="revisit-nafter" content="50 days" />
            {/*<!-- Open Graph / Facebook -->*/}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={'https://link.spencerraymon.de' + location.pathname} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta
                property="og:image"
                content={pageContext.albumArt.images.fallback ? pageContext.albumArt.images.fallback.src : ''}
            />
            {/* <!-- Twitter --> */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={'https://link.spencerraymon.de' + location.pathname} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta
                property="twitter:image"
                content={pageContext.albumArt.images.fallback ? pageContext.albumArt.images.fallback.src : ''}
            ></meta>
            <html lang="en" />
        </>
    );
}

export default ({ pageContext }: { pageContext: Context }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [sLinks, setSLinks] = useState<React.ReactElement[]>([]);

    useEffect(() => {
        const mobileMediaQuery = matchMedia('(max-width: 800px)');

        const listener = () => {
            setIsMobile(mobileMediaQuery.matches);
        };

        mobileMediaQuery.addEventListener('change', listener);

        listener();

        return () => mobileMediaQuery.removeEventListener('change', listener);
    }, []);

    useEffect(() => {
        const rawLinks = pageContext.links;

        setSLinks(
            rawLinks.map((rawLink, i) => {
                return rawLink.url !== null ? (
                    <a key={rawLink.name} href={rawLink.url} className="listItem">
                        <ListItem>{rawLink.name}</ListItem>
                    </a>
                ) : <></>;
            }).filter(e => e.key)
        );
    }, []);

    const mainRef = useRef<HTMLDivElement>(null);

    const mouseMoveHandle = useCallback(
        (e: any) => {
            if (!mainRef.current) {
                return;
            }

            if (!isMobile) {
                const size = (Math.max(innerWidth, innerHeight) / 50) * -1;
                const pageX = (e.clientX - window.innerWidth / 2) / size,
                    pageY = (e.clientY - window.innerHeight / 2) / size;

                mainRef.current.querySelectorAll('.shit').forEach((element) => {
                    const scale = +(element.getAttribute('data-parallax-scale') ?? '1');

                    (element as HTMLElement).style.transform = `translateX(${pageX * scale}px) translateY(${pageY * scale
                        }px)`;
                });
            }
        },
        [isMobile]
    );

    return (
        <main ref={mainRef}>
            <div
                className="noisyBG"
                style={{
                    backgroundColor: pageContext.palette,
                }}
            ></div>
            <div className="splashBG splashContainer" onMouseMove={mouseMoveHandle}>
                <div className="leftList">
                    <div className="listContainer shit" data-parallax-scale={0.2}>
                        {sLinks}
                        <div className="titleBar">
                            <h3>{parseReleaseDate(pageContext.releaseDate)}</h3>
                            <a className={'h1Link'} href={'https://spencerraymon.de'}>
                                <h1>Spencer Raymond</h1>
                            </a>
                            <div className="socialLinks">
                                {links.map((link, i) => (
                                    <div key={i} className="social">
                                        <a href={link.url}>{link.name}</a>
                                    </div>
                                ))}
                                <div className="social">
                                    <a href="https://spencerraymon.de/presskit">Press Kit</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {isMobile ? (
                    <></>
                ) : (
                    <div className="rightShow">
                        <div>
                            <div className="showContainer">
                                <div className="imageDiv shit" data-parallax-scale={1}>
                                    <GatsbyImage alt={pageContext.title} image={pageContext.albumArt} className="showImage" />
                                    <div className="headingDiv shit" data-parallax-scale={2}>
                                        <h3 className="showText">{pageContext.title}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

type Context = {
    title: string;
    releaseDate: string;
    albumArt: IGatsbyImageData;
    palette: string;
    artist: string;
    links: [
        {
            url: string;
            name: string;
        }
    ];
};
