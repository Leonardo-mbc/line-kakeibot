module.exports = {
  postPicture: async ({ buffer, contentType, filepath }) => {
    try {
      const response = await fetch(
        `https://postpicturev2-hcv64sau7a-uc.a.run.app?filepath=${filepath}`,
        {
          method: "POST",
          headers: {
            "Content-Type": contentType,
          },
          body: buffer,
        }
      );

      if (response.ok) {
        return;
      } else {
        const { message } = await response.text();
        console.error("%%%% Error in postPicture/!response.ok", error);
        throw {
          message,
          status: response.status,
        };
      }
    } catch ({ status, message }) {
      console.error("%%%% Error in postPicture", error);
      throw {
        message,
        status,
      };
    }
  },
};
