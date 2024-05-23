import {IPost} from "./Posts.tsx";

interface PostProps {
    post: IPost
}

function Post({post}: PostProps) {
    const getVoteCount = () => {
        const upVotesCount = post.votes.filter(vote => vote.voteType === "Upvote").length;
        const downVotesCount = post.votes.length - upVotesCount;
        return upVotesCount - downVotesCount + 1;
    }
    
    const username = post?.memberPostedBy.user.username;
    return (
        <div className="post-item">
        <div className="post-item-votes">
            <div className="post-item-upvote">
                <img src="arrow.svg" alt={""}/>
            </div>
            <div>{getVoteCount()}</div>
            <div className="post-item-downvote">
                <img src="arrow.svg" alt={""}/>
            </div>
        </div>
    <div className="post-item-content">
        <div className="post-item-title">{post.title}</div>
        <div className="post-item-details">
            <div>{Math.floor((Date.now() - new Date(post.dateCreated).getTime()) / 86400) } days ago</div>
            <a href={`/member/${username}`}> by {username} </a>
            <div>{post.comments.length} comments</div>
        </div>
    </div>
</div>
)
}

export default Post;