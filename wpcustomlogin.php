

<?php  
       $username = $_POST['username'];
        $password = $_POST['password'];
        $user_email = $_POST['email'];
        if(/**check the login from navya server**/){
            if ( username_exists( $username ) )
                {
                //login using given passwordm, more formation on this page http://codex.wordpress.org/Function_Reference/wp_signon
       }   else {
           // create a new user using wp_create_user
            $user_id = wp_create_user( $username, $password, $user_email );
       }
        } else //write code for wrong password ;
?>

