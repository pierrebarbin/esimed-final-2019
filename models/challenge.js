module.exports = class Challenge {
    constructor(id,content,is_realized,amount_like,user_id,created_at) {
        this.id = id;
        this.content = content;
        this.is_realized = is_realized;
        this.amount_like = amount_like;
        this.user_id = user_id;
        this.created_at = created_at;
    }
}