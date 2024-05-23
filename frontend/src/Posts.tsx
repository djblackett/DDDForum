import {useEffect, useState} from "react";
import Post from "./Post.tsx";
import { useSearchParams } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";

function Loader() {
    return (
        <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={true}
        />
    )
}

export interface IPost {
    title: string,
    votes: Vote[],
    memberPostedBy: Member,
    comments: [],
    dateCreated: Date
}

interface User {
    username: string
}
interface Member {
    // username: string,
    user: User
}

interface Vote {
    voteType: "Upvote" | "Downvote"
}

function Posts() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [posts, setPosts] = useState<IPost[]>()
    const [isDataLoading, setIsDataLoading] = useState(false);

    const getPosts = async (sort?: string) => {
        setIsDataLoading(true)
        let url = "http://localhost:5000/posts";
        if (sort === "recent") {
            url += "?sort=recent";
        } else if (sort === "popular") {
            url += "?sort=popular"
        }
        const posts = await fetch(url);
        if (posts.ok) {
            setPosts(await posts.json())
        }
        setIsDataLoading(false)
    }
    useEffect(() => {
        getPosts()
    }, [])

    useEffect(() => {
            const param = searchParams.get("sort");
            if (param) {
                getPosts(param)
            }
    }, [searchParams]);

    const handleClick = (query: string) => {
        setSearchParams({sort: query});
        const recent = document.getElementById("recent") as HTMLElement;
        const popular = document.getElementById("popular") as HTMLElement;

        if (query === "recent") {
            recent.className = "active"
            popular.className = ""
        } else {
            recent.className = ""
            popular.className = "active"
        }
    }


    return (
        <>
        <div className="content-container flex">
            <div className="posts-view-switcher flex">
               <div id="popular" className="active" onClick={() => handleClick("popular")}>Popular</div>
              <div id="recent" className="" onClick={() => handleClick("recent")}>New</div>
            </div>
        </div>
            <div className="posts-list">
                {isDataLoading && <Loader />}
            {posts && posts.map(post => <Post post={post}/>)}
        </div>
        </>
    )
}

export default Posts;