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

    const getDateFormat = (date: Date) => {
        const timeElapsed = (Date.now() - new Date(date).getTime()) / 86400000 // # of ms in a day
        if (timeElapsed < 1) {
            return "today"
        }
        if (timeElapsed < 30) {
            return `${Math.floor(timeElapsed)} days ago`
        }
        else if (timeElapsed > 365) {
            const result = Math.floor(timeElapsed / 365)
            if (result === 1) {
                return `${result} year ago`
            } else {
                return `${result} years ago`
            }
        }
        else if (timeElapsed >= 30) {
            return `${Math.floor(timeElapsed / 30)} months ago`
        }
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
            <div>{getDateFormat(post.dateCreated)}</div>
            <a href={`/member/${username}`}> by {username} </a>
            <div>{post.comments.length} comments</div>
        </div>
    </div>
</div>
)
}

export default Post;