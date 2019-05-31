module.exports = class Comment {
    constructor(id,content,is_proof,media,type_media,is_accepted,user_id,challenge_id,created_at) {
        this.id = id;
        this.content = content;
        this.is_proof = is_proof;
        this.media = media;
        this.type_media = type_media;
        this.is_accepted = is_accepted;
        this.user_id = user_id;
        this.challenge_id = challenge_id;
        this.created_at = created_at;
    }
}