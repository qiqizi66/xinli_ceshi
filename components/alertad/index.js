
getApp();

Component({
    data: {
        close: + "/images/close.png"
    },
    options: {},
    properties: {},
    attached: function() {},
    methods: {
        closeHandle: function(e) {
            this.triggerEvent("closeevent");
        }
    }
});