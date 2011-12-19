jQuery ( document ).ready( function() {
    simplecmsloadBind('div.simplecms-edit');
    simplecmsloadBindInner('div.simplecms-edit');
} );

function simplecmsAjaxing(href, me){
    //var dialog = jQuery('<div id="simplecms-dialog" name="'+replacmentid+'">'+html+'</div>').dialog({
    var dialog = jQuery('<div id="simplecms-dialog" class="loading">loading</div>').dialog({
        dialogClass: 'simplecms-jquery-dialog',
        height: 'auto',
        width: 'auto',
        modal: true,
        resizable: false,
        title: 'SimpleCMS',
        buttons: {
            "Save": function() {
                var parrent = this;
                jQuery('#simplecms-dialog form').ajaxForm({
                    success: function(data, statusText, xhr, form){
                        source = jQuery(parrent).attr('name');
                        if(source != jQuery(data).attr('id') ){
                            jQuery(data).dialog({
                                dialogClass: 'simplecms-jquery-dialog',
                                title: 'can\'t save'
                            });
                        }else{
                            jQuery('.'+source).html(jQuery(data).html());
                            if(jQuery('#'+source).hasClass('simplecms-edit-collection')){
                                simplecmsloadBind('.'+source+' div.simplecms-edit');  
                                simplecmsloadBindInner('.'+source);    
                            }else{
                                simplecmsloadBindInner('.'+source);
                            }
                        }
                        jQuery(this).dialog("close");
                        jQuery('#simplecms-dialog').remove();
                    },
                    error: function(html){
                        alert('can\'t save');
                        jQuery(this).dialog("close");
                        jQuery('#simplecms-dialog').remove();
                                
                    }
                }).submit();
                       
            }
        }
    });
    jQuery.ajax({
        url: href,
        context: me,
        success: function(html) {   
            var replacmentid = jQuery(this).attr('id');
            if(jQuery(this).hasClass('simplecms-add')){
                replacmentid = jQuery(this).parent().attr('id')
            }
            
            dialog.attr('name', replacmentid)
                .html(html)
                .find('textarea')
                .tinymce(simple_cms_wysiwyg_config)
                ;
            //recenter the dialog
            dialog.dialog('option', 'position', 'center');
        },
        error: function()
        {
            alert('forbidden');
        }
    });
}

function simplecmsloadBindInner(parent){
    jQuery(parent+' a.simplecms-editlink').bind('click', function(event){
        event.preventDefault();
        event.stopPropagation();
        
        var me = jQuery(this).parent('div');
        var href = jQuery(this).attr('href') ;        
        simplecmsAjaxing(href,me);        
    });    
    jQuery(parent+' a.simplecms-deletelink').bind('click', function(event){
        event.preventDefault();
        event.stopPropagation();
        if(false==confirm(  "delete ?")){
            return false;
        }
        var me = jQuery(this).parent('div');
        var href = jQuery(this).attr('href') ;        
        jQuery.ajax({
            url: href,
            context: me,
            success: function(data) {
                if(jQuery(this).parent().hasClass('simplecms-edit-collection')){
                   jQuery(this).hide();
                }else{
                    jQuery(this).html(jQuery(data).html());
                    simplecmsloadBindInner('#'+jQuery(this).attr('id'));   
                }
            },
            error: function()
            {
                alert('forbidden');
            }
        });      
    });       
}

function simplecmsloadBind(classtobind){    
    jQuery(classtobind).bind('mouseenter', function(event){
        var $this =  jQuery(this);
        $this.data('simplecms-css-zindex', $this.css('zIndex'));
        $this.addClass('active')
            .css('zIndex', 9999);
    });
    jQuery(classtobind).bind('mouseleave', function(event){
        var $this = jQuery(this);
        $this.removeClass('active')
            .css('zIndex', $this.data('simplecms-css-zindex'));
    });    
    jQuery(classtobind).bind('dblclick', function(event){
        event.preventDefault();
        event.stopPropagation();
        
        var me = jQuery(this);
        var href = me.children('a.simplecms-editlink').attr('href') ;        
        simplecmsAjaxing(href,me);
    });
}