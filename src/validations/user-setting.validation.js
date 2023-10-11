const Joi = require("joi");
const { objectId, password, tokenRegex } = require("./custom.validations");

const manage_privacy_settings = {
  headers: Joi.object().keys({
    authorization: Joi.string()
      .required()
      .regex(tokenRegex)
      .message('"{{#label}}" must be a valid token type'),
  }),
  body: Joi.object().keys({
    is_visible_online: Joi.boolean(),
    is_profile_private: Joi.boolean(),
    show_following_count: Joi.boolean(),
    show_follower_count: Joi.boolean(),
    show_media_count: Joi.boolean(),
    is_login_redirect: Joi.boolean(),
    is_allow_suggestions: Joi.boolean(),
    is_want_comment: Joi.boolean(),
    is_comment_only_for_payers: Joi.boolean(),
    show_post_tips_sum: Joi.boolean(),
    is_watermark_photo: Joi.boolean(),
    is_watermark_video: Joi.boolean(),
    is_watermark_text: Joi.boolean(),
  }),
};

module.exports = {
  manage_privacy_settings,
};
