import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import axios from "axios";
import { toast } from "sonner";
import {
    Heart,
    MessageSquare,
    ArrowLeft,
    Send,
    Users,
    Clock,
    Leaf,
    Apple,
    Carrot,
    ChefHat,
    Utensils
} from "lucide-react";
import { useHealthProfileStore } from "../store/useUserInformationStore"
const DisplayPost = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { user } = useUserStore();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [replyText, setReplyText] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [showAllComments, setShowAllComments] = useState(false);
    const [pollUpdateInterval, setPollUpdateInterval] = useState(null);
    const { profile } = useHealthProfileStore();
    const fullname = profile?.fullName;
    const categoryIcons = {
        recipes: <ChefHat size={18} />,
        nutrition: <Leaf size={18} />,
        diet: <Apple size={18} />,
        wellness: <Carrot size={18} />,
        all: <Utensils size={18} />
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_URL || 'http://localhost:3000'}/api/v1/posts/${postId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );


                const transformedPost = {
                    ...response.data,
                    isLiked: response.data.likedBy?.includes(user?._id) || false,
                    poll: response.data.poll ? {
                        ...response.data.poll,
                        expiresAt: new Date(response.data.poll.expiresAt),
                        hasVoted: response.data.poll.votedBy?.includes(user?._id) || false,
                        selectedOption: response.data.poll.options.findIndex(opt =>
                            opt.votedBy?.includes(user?._id)
                        ),
                        options: response.data.poll.options.map(opt => ({
                            ...opt,
                            percentage: response.data.poll.totalVotes > 0
                                ? Math.round((opt.votes / response.data.poll.totalVotes) * 100)
                                : 0
                        }))
                    } : null,
                };

                setPost(transformedPost);
            } catch (error) {
                toast.error("Failed to fetch post");
                console.error("Fetch post error:", error);
                navigate("/posts");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);


    const handleLike = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_URL || 'http://localhost:3000'}/api/v1/posts/${postId}/like`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            fetchPost();
        } catch (error) {
            toast.error("Failed to like post");
        }
    };


    const handleVote = async (optionIndex) => {
        if (!post?.poll) return;
        const previousPost = { ...post };

        try {

            setPost(prev => {
                const updatedOptions = prev.poll.options.map((opt, idx) => {
                    if (idx === optionIndex && prev.poll.selectedOption === optionIndex) {

                        return {
                            ...opt,
                            votes: Math.max(0, opt.votes - 1)
                        };
                    }
                    if (idx === optionIndex) {

                        return {
                            ...opt,
                            votes: opt.votes + 1
                        };
                    }
                    if (idx === prev.poll.selectedOption) {

                        return {
                            ...opt,
                            votes: Math.max(0, opt.votes - 1)
                        };
                    }
                    return opt;
                });


                const totalVotes = updatedOptions.reduce((sum, opt) => sum + opt.votes, 0);
                const optionsWithPercentages = updatedOptions.map(opt => ({
                    ...opt,
                    percentage: totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0
                }));

                return {
                    ...prev,
                    poll: {
                        ...prev.poll,
                        options: optionsWithPercentages,
                        totalVotes,
                        hasVoted: true,
                        selectedOption: prev.poll.selectedOption === optionIndex ? null : optionIndex
                    }
                };
            });


            const response = await axios.post(
                `${import.meta.env.VITE_URL || 'http://localhost:3000'}/api/v1/posts/${postId}/vote`,
                { optionIndex },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            );

            if (response.data) {
                setPost(prev => ({
                    ...prev,
                    poll: {
                        ...prev.poll,
                        options: prev.poll.options.map((opt, idx) => ({
                            ...opt,
                            votes: response.data.pollResults[idx]?.votes || opt.votes,
                            percentage: response.data.pollResults[idx]?.percentage || 0
                        })),
                        totalVotes: response.data.totalVotes,
                        hasVoted: response.data.hasVoted,
                        selectedOption: response.data.selectedOption
                    }
                }));
            }
        } catch (error) {

            setPost(previousPost);
            toast.error("Failed to vote on poll");
        }
    };


    const handleAddComment = async () => {
        if (!commentText.trim()) return;

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_URL || 'http://localhost:3000'}/api/v1/posts/${postId}/comment`,
                { text: commentText },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }}
            );

            setPost(prev => ({
                ...prev,
                comments: [...prev.comments, response.data],
                commentCount: prev.commentCount + 1,
            }));
            setCommentText("");
        } catch (error) {
            toast.error("Failed to add comment");
        }
    };

    const handleAddReply = async (commentId) => {
        if (!replyText.trim()) return;

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_URL || 'http://localhost:3000'}/api/v1/posts/comment/${commentId}/reply`,
                { text: replyText, userFullName: fullname },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            setPost(prev => ({
                ...prev,
                comments: prev.comments.map(comment =>
                    comment._id === commentId
                        ? { ...comment, replies: [...comment.replies, response.data] }
                        : comment
                ),
            }));
            setReplyText("");
            setReplyingTo(null);
        } catch (error) {
            toast.error("Failed to add reply");
        }
    };

    const getCategoryStyle = (category) => {
        const styles = {
            recipes: "bg-gradient-to-r from-amber-100 to-amber-50 border-l-4 border-amber-400",
            nutrition: "bg-gradient-to-r from-green-100 to-green-50 border-l-4 border-green-400",
            diet: "bg-gradient-to-r from-blue-100 to-blue-50 border-l-4 border-blue-400",
            wellness: "bg-gradient-to-r from-purple-100 to-purple-50 border-l-4 border-purple-400",
            default: "bg-gradient-to-r from-gray-100 to-gray-50 border-l-4 border-gray-400"
        };

        return styles[category] || styles.default;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
                <h1 className="text-2xl font-bold text-gray-800">Post not found</h1>
                <button
                    onClick={() => navigate("/posts")}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 mt-4 px-4 py-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Nutrition Feed</span>
                </button>
            </div>
        );
    }

    const categoryName = post.category || "all";
    const categoryStyle = getCategoryStyle(categoryName);
    const categoryIcon = categoryIcons[categoryName] || categoryIcons.all;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
            <div className="max-w-2xl mx-auto px-4">

                <button
                    onClick={() => navigate("/posts")}
                    className="flex items-center space-x-2 text-emerald-700 hover:text-emerald-600 mb-6 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Nutrition Feed</span>
                </button>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">

                    <div className="p-4 border-b">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white font-medium shadow-md">
                                {post.userFullName?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <Link
                                    to={`/profile/${post.user?._id}`}
                                    className="font-medium text-lg hover:underline text-emerald-800"
                                >
                                    {post.userFullName || 'Unknown User'}
                                </Link>
                                <p className="text-sm text-gray-500 flex items-center">
                                    {post.formattedTimestamp}
                                </p>
                            </div>
                        </div>
                    </div>


                    <div className={`p-6 ${categoryStyle}`}>

                        {post.category !== "all" && (
                            <div className="mb-4">
                                <span className="px-4 py-1.5 text-sm font-medium bg-white text-emerald-700 rounded-full shadow-sm inline-flex items-center gap-1.5 border border-emerald-100">
                                    {categoryIcon}
                                    {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                                </span>
                            </div>
                        )}


                        {post.text && (
                            <p className="text-gray-800 whitespace-pre-line mb-6 text-lg leading-relaxed">
                                {post.text}
                            </p>
                        )}


                        {post.images?.url && (
                            <div className="rounded-xl overflow-hidden mb-6 shadow-md">
                                <img
                                    src={post.images.url}
                                    alt="Nutrition content"
                                    className="w-full h-auto"
                                />
                            </div>
                        )}


                        {post.poll.options.length > 0 && (
                            <div className="p-5 bg-white rounded-xl shadow-md mb-2">
                                <h3 className="font-semibold text-xl mb-5 text-emerald-800">{post.poll.question}</h3>
                                <div className="space-y-3">
                                    {post.poll.options.map((option, index) => {
                                        const isSelected = post.poll.selectedOption === index;
                                        const percentage = option.percentage || 0;

                                        return (
                                            <div key={index} className="relative">
                                                <button
                                                    onClick={() => handleVote(index)}
                                                    disabled={post.poll.expiresAt < new Date()}
                                                    className={`group w-full text-left relative z-10 px-4 py-3 rounded-lg border-2 transition-all duration-300 
                                            ${isSelected
                                                            ? "border-emerald-500 bg-emerald-50"
                                                            : "border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30"}`}
                                                >

                                                    {(post.poll.hasVoted || isSelected) && (
                                                        <div
                                                            className={`absolute top-0 left-0 h-full rounded-lg transition-all duration-500 
                                                    ${isSelected ? "bg-emerald-100" : "bg-gray-100"}`}
                                                            style={{ width: `${percentage}%`, zIndex: -1 }}
                                                        />
                                                    )}

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 
                                                    flex items-center justify-center 
                                                    ${isSelected
                                                                    ? "border-emerald-500 bg-emerald-500"
                                                                    : "border-gray-300 group-hover:border-emerald-300"}`}
                                                            >
                                                                {isSelected && (
                                                                    <div className="w-2 h-2 rounded-full bg-white" />
                                                                )}
                                                            </div>
                                                            <span className={`font-medium 
                                                    ${isSelected ? "text-emerald-700" : "text-gray-700"}`}
                                                            >
                                                                {option.text}
                                                            </span>
                                                        </div>
                                                        {(post.poll.hasVoted || isSelected) && (
                                                            <span className={`text-sm font-semibold 
                                                    ${isSelected ? "text-emerald-600" : "text-gray-500"}`}
                                                            >
                                                                {percentage}%
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <Users size={16} className="text-gray-400" />
                                        <span>{post.poll.totalVotes} vote{post.poll.totalVotes !== 1 ? "s" : ""}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm">
                                        <Clock size={16} className={post.poll.expiresAt < new Date()
                                            ? "text-red-400"
                                            : "text-emerald-400"}
                                        />
                                        <span className={post.poll.expiresAt < new Date()
                                            ? "text-red-500"
                                            : "text-emerald-500"}
                                        >
                                            {post.poll.expiresAt < new Date()
                                                ? "Poll ended"
                                                : `${Math.ceil((post.poll.expiresAt - new Date()) / (1000 * 60 * 60 * 24))} days left`
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>


                    <div className="flex items-center space-x-6 px-6 py-4 border-t border-b bg-gray-50">
                        <button
                            onClick={handleLike}
                            className={`flex items-center space-x-2 ${post.isLiked ? "text-red-500" : "text-gray-600"
                                } hover:scale-105 transition-transform`}
                        >
                            <Heart
                                size={22}
                                fill={post.isLiked ? "currentColor" : "none"}
                                className={post.isLiked ? "animate-pulse" : ""}
                            />
                            <span className="font-medium">{post.likes}</span>
                        </button>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <MessageSquare size={22} />
                            <span className="font-medium">{post.commentCount}</span>
                        </div>
                    </div>

                    <div className="p-6 bg-gradient-to-b from-white to-gray-50">
                        <h3 className="text-lg font-semibold text-emerald-800 mb-4">Comments</h3>

                        <div className="flex items-start space-x-3 mb-8 bg-white p-4 rounded-xl shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white font-medium shadow-sm">
                                {fullname?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 relative">
                                <textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Share your thoughts on this nutrition post..."
                                    className="w-full px-4 py-2 pr-12 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 resize-none"
                                    rows={2}
                                />
                                <button
                                    onClick={handleAddComment}
                                    disabled={!commentText.trim()}
                                    className="absolute right-2 bottom-2 p-2 text-emerald-500 hover:text-emerald-600 disabled:opacity-50 hover:scale-110 transition-transform"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {post.comments
                                .slice(0, showAllComments ? undefined : 3)
                                .map((comment) => (
                                    <div key={comment._id} className="animate-fadeIn">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center text-white text-sm shadow-sm">
                                                {comment.userFullName?.[0]?.toUpperCase() ||
                                                    'U'}
                                            </div>
                                            <div className="flex-1">
                                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                                    <div className="flex items-center justify-between mb-2">

                                                        {comment.userFullName}

                                                        <span className="text-xs text-gray-500">
                                                            {comment.formattedTimestamp}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-800">
                                                        {comment.text}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        setReplyingTo(
                                                            replyingTo === comment._id
                                                                ? null
                                                                : comment._id
                                                        )
                                                    }
                                                    className="text-sm text-emerald-600 hover:text-emerald-700 mt-2 ml-2 flex items-center gap-1"
                                                >
                                                    <MessageSquare size={14} />
                                                    Reply
                                                </button>

                                                {comment.replies?.length > 0 && (
                                                    <div className="ml-8 mt-3 space-y-3">
                                                        {comment.replies.map((reply) => (
                                                            <div
                                                                key={reply._id}
                                                                className="flex items-start space-x-3"
                                                            >
                                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs shadow-sm">
                                                                    {reply.userFullName?.[0]
                                                                        ?.toUpperCase() || 'U'}
                                                                </div>
                                                                <div className="flex-1 bg-white rounded-xl p-3 shadow-sm">
                                                                    <div className="flex items-center justify-between mb-1">

                                                                        {
                                                                            reply.userFullName
                                                                        }

                                                                        <span className="text-xs text-gray-500">
                                                                            {
                                                                                reply.formattedTimestamp
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm text-gray-800">
                                                                        {reply.text}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {replyingTo === comment._id && (
                                                    <div className="ml-8 mt-3">
                                                        <div className="flex items-start space-x-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs shadow-sm">
                                                                {fullname?.[0]?.toUpperCase() ||
                                                                    'U'}
                                                            </div>
                                                            <div className="flex-1 relative">
                                                                <input
                                                                    type="text"
                                                                    value={replyText}
                                                                    onChange={(e) =>
                                                                        setReplyText(
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    placeholder="Write a reply..."
                                                                    className="w-full px-3 py-2 pr-10 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                                                                />
                                                                <button
                                                                    onClick={() =>
                                                                        handleAddReply(
                                                                            comment._id
                                                                        )
                                                                    }
                                                                    disabled={!replyText.trim()}
                                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-emerald-500 hover:text-emerald-600 disabled:opacity-50 hover:scale-110 transition-transform"
                                                                >
                                                                    <Send size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {post.comments.length > 3 && (
                            <button
                                onClick={() => setShowAllComments(!showAllComments)}
                                className="mt-6 text-emerald-600 hover:text-emerald-700 font-medium px-4 py-2 rounded-full border border-emerald-200 hover:bg-emerald-50 transition-colors flex items-center justify-center mx-auto"
                            >
                                {showAllComments
                                    ? "Show less comments"
                                    : `Show all ${post.comments.length} comments`}
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-amber-400 mb-6">
                    <div className="flex items-center space-x-3 text-amber-600 mb-2">
                        <Leaf size={20} />
                        <h3 className="font-semibold">Nutrition Tip</h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                        Remember to stay hydrated while exploring nutrition content! Water helps your body absorb nutrients more effectively.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DisplayPost;